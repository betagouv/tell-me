import { runMiddleware } from '@api/helpers/runMiddleware'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { UserRole } from '@prisma/client'
import dayjs from 'dayjs'
import { getUser } from 'nexauth'

import { ApiError } from '../../libs/ApiError'
import { prisma } from '../../libs/prisma'
import { withCors } from '../withCors'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'api/middlewares/withAuth/handler()'

export async function handleAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedRoles: UserRole[] = [UserRole.ADMINISTRATOR],
  isPublic: boolean = false,
) {
  let userId: string

  try {
    // Only public routes can be accessed via PATs
    if (isPublic && typeof req.query.personalAccessToken === 'string') {
      // —————————————————————————————————————————————————————————————————————————————
      // PAT-based authentication
      // Cancellable 90 days tokens used for external back-end private API requests.

      // Only GET routes can be public:
      if (req.method !== 'GET') {
        throw new ApiError(`Unauthorized.`, 401, true)
      }

      // Set Access-Control-Allow-Origin responde header to "*"
      // in order to allow API calls from anywhere in public routes
      await runMiddleware(req, res, withCors())

      const personalAccessToken = Array.isArray(req.query.personalAccessToken)
        ? req.query.personalAccessToken[0]
        : req.query.personalAccessToken

      const maybePersonalAccessToken = await prisma.personalAccessToken.findUnique({
        where: {
          value: personalAccessToken,
        },
      })
      if (maybePersonalAccessToken === null) {
        throw new ApiError(`Unauthorized.`, 401, true)
      }
      if (dayjs().isAfter(dayjs(maybePersonalAccessToken.expiredAt))) {
        await prisma.personalAccessToken.delete({
          where: {
            value: personalAccessToken,
          },
        })

        throw new ApiError(`Unauthorized.`, 401, true)
      }

      userId = maybePersonalAccessToken.userId
    } else if (req.query.oneTimeToken !== undefined) {
      // —————————————————————————————————————————————————————————————————————————————
      // OTT-based authentication
      // Disposable tokens used for internal front-end private API requests.

      const oneTimeToken = Array.isArray(req.query.oneTimeToken) ? req.query.oneTimeToken[0] : req.query.oneTimeToken

      const maybeOneTimeToken = await prisma.oneTimeToken.findUnique({
        where: {
          value: oneTimeToken,
        },
      })
      if (maybeOneTimeToken === null) {
        throw new ApiError(`Unauthorized.`, 401, true)
      }
      if (dayjs().isAfter(dayjs(maybeOneTimeToken.expiredAt))) {
        await prisma.oneTimeToken.delete({
          where: {
            value: oneTimeToken,
          },
        })

        throw new ApiError(`Unauthorized.`, 401, true)
      }

      await prisma.oneTimeToken.delete({
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
        throw new ApiError(`Unauthorized.`, 401, true)
      }

      userId = user.id
    }

    const user = await prisma.user.findUnique({
      select: {
        id: true,
        isActive: true,
        role: true,
      },
      where: {
        id: userId,
      },
    })
    if (user === null || !user.isActive) {
      throw new ApiError(`Unauthorized.`, 401, true)
    }
    if (!allowedRoles.includes(user.role)) {
      throw new ApiError(`Forbidden.`, 403, true)
    }

    return user
  } catch (err) {
    return handleApiEndpointError(err, ERROR_PATH, res)
  }
}
