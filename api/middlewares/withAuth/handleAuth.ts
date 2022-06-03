import { USER_ROLE } from '@common/constants'
import { handleError } from '@common/helpers/handleError'
import dayjs from 'dayjs'
import { getUser } from 'nexauth'

import ApiError from '../../libs/ApiError'

import type { RequestWithAuth, RequestWithPrisma } from '../../types'
import type { NextApiResponse } from 'next'

const ERROR_PATH = 'api/middlewares/withAuth/handler()'

export async function handleAuth(
  req: RequestWithPrisma,
  res: NextApiResponse,
  allowedRoles = [USER_ROLE.ADMINISTRATOR],
  isPublic: boolean = false,
) {
  let userId: string

  try {
    if (typeof req.query.personalAccessToken === 'string') {
      // —————————————————————————————————————————————————————————————————————————————
      // PAT-based authentication
      // Cancellable 90 days tokens used for external back-end private API requests.

      if (!isPublic) {
        return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
      }

      const personalAccessToken = Array.isArray(req.query.personalAccessToken)
        ? req.query.personalAccessToken[0]
        : req.query.personalAccessToken

      const maybePersonalAccessToken = await req.db.personalAccessToken.findUnique({
        where: {
          value: personalAccessToken,
        },
      })
      if (maybePersonalAccessToken === null) {
        return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
      }
      if (dayjs().isAfter(dayjs(maybePersonalAccessToken.expiredAt))) {
        await req.db.personalAccessToken.delete({
          where: {
            value: personalAccessToken,
          },
        })

        return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
      }

      userId = maybePersonalAccessToken.userId
    } else if (req.query.oneTimeToken !== undefined) {
      // —————————————————————————————————————————————————————————————————————————————
      // OTT-based authentication
      // Disposable tokens used for internal front-end private API requests.

      const oneTimeToken = Array.isArray(req.query.oneTimeToken) ? req.query.oneTimeToken[0] : req.query.oneTimeToken

      const maybeOneTimeToken = await req.db.oneTimeToken.findUnique({
        where: {
          value: oneTimeToken,
        },
      })
      if (maybeOneTimeToken === null) {
        return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
      }
      if (dayjs().isAfter(dayjs(maybeOneTimeToken.expiredAt))) {
        await req.db.oneTimeToken.delete({
          where: {
            value: oneTimeToken,
          },
        })

        return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
      }

      await req.db.oneTimeToken.delete({
        where: {
          value: oneTimeToken,
        },
      })

      userId = maybeOneTimeToken.userId
    } else {
      // —————————————————————————————————————————————————————————————————————————————
      // JWT-based authentication
      // Cancellable 30 days tokens used for internal front-end private API requests.

      const user = await getUser(req)
      if (user === undefined) {
        return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
      }

      userId = user.id
    }

    const maybeUser = await req.db.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (maybeUser === null || !maybeUser.isActive) {
      return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
    }

    if (!allowedRoles.includes(maybeUser.role)) {
      return handleError(new ApiError(`Forbidden.`, 403, true), ERROR_PATH, res)
    }

    const reqWithAuth: RequestWithAuth = Object.assign(req, {
      me: {
        id: userId,
      },
    })

    return {
      reqWithAuth,
      res,
    }
  } catch (err) {
    return handleError(err, ERROR_PATH, res)
  }
}
