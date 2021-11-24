import dayjs from 'dayjs'
import { NextApiResponse } from 'next'
import R from 'ramda'

import { USER_ROLE } from '../../common/constants'
import getJwtPayload from '../helpers/getJwtPayload'
import handleError from '../helpers/handleError'
import ApiError from '../libs/ApiError'
import OneTimeToken from '../models/OneTimeToken'
import User from '../models/User'
import { HandlerWithAuth, RequestMe, RequestWithAuth } from '../types'

const ERROR_PATH = 'api/middlewares/withAuth()'

export default function withAuth(handler: HandlerWithAuth, allowedRoles = [USER_ROLE.ADMINISTRATOR]) {
  const handlerWithAuth = async (req: RequestWithAuth, res: NextApiResponse) => {
    let userId: string
    let userNewId: string

    try {
      if (req.query.personalAccessToken !== undefined) {
        // —————————————————————————————————————————————————————————————————————————————
        // PAT-based authentication
        // Cancellable 90 days tokens used for external back-end private API requests.

        const [personalAccessToken] = req.query.personalAccessToken

        const maybePersonalAccessToken = await req.db.personalAccessToken.findUnique({
          include: {
            user: true,
          },
          where: {
            value: personalAccessToken,
          },
        })
        if (maybePersonalAccessToken === null || dayjs().isAfter(dayjs(maybePersonalAccessToken.expiredAt))) {
          return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
        }

        userId = maybePersonalAccessToken.user.legacyId
        userNewId = maybePersonalAccessToken.user.id
      } else if (req.query.accessToken !== undefined) {
        // —————————————————————————————————————————————————————————————————————————————
        // OTT-based authentication
        // Disposable tokens used for internal front-end private API requests.

        const maybeOneTimeToken = await OneTimeToken.findOneAndDelete({
          value: req.query.oneTimeToken,
        })
        if (maybeOneTimeToken === null) {
          return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
        }

        userId = maybeOneTimeToken.user.toString()

        const maybeNewUser = await req.db.user.findUnique({
          where: {
            legacyId: userId,
          },
        })
        if (maybeNewUser === null) {
          return handleError(new ApiError(`Legacy and new databases are not in sync.`, 500), ERROR_PATH, res)
        }

        userNewId = maybeNewUser.id
      } else {
        // —————————————————————————————————————————————————————————————————————————————
        // JWT-based authentication
        // Cancellable 30 days tokens used for internal front-end private API requests.

        const authorizationHeader = req.headers.authorization

        if (authorizationHeader === undefined || !/^Bearer .+$/.test(authorizationHeader)) {
          return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
        }

        const maybeSessionTokenResult = /^Bearer (.+)$/.exec(authorizationHeader)
        if (maybeSessionTokenResult === null) {
          return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
        }

        const sessionToken = maybeSessionTokenResult[1]
        const maybeTokenPayload = await getJwtPayload(sessionToken)
        if (maybeTokenPayload === null) {
          return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
        }

        userId = maybeTokenPayload._id

        const maybeNewUser = await req.db.user.findUnique({
          where: {
            legacyId: userId,
          },
        })
        if (maybeNewUser === null) {
          return handleError(new ApiError(`Legacy and new databases are not in sync.`, 500), ERROR_PATH, res)
        }

        userNewId = maybeNewUser.id
      }

      const user = await User.findById(userId).exec()
      if (user === null || !user.isActive) {
        return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
      }

      if (!allowedRoles.includes(user.role)) {
        return handleError(new ApiError(`Forbidden.`, 403, true), ERROR_PATH, res)
      }

      const reqWithAuth: RequestWithAuth = Object.assign(req, {
        me: R.pick(['id'], user) as RequestMe,
        newMe: {
          id: userNewId,
        },
      })

      return await handler(reqWithAuth, res)
    } catch (err) {
      return handleError(err, ERROR_PATH, res)
    }
  }

  return handlerWithAuth
}
