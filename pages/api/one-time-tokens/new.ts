import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { UserRole } from '@prisma/client'
import crypto from 'crypto'
import dayjs from 'dayjs'
import { promisify } from 'util'

import type { NextApiRequest, NextApiResponse } from 'next'

const { NODE_ENV } = process.env
const ERROR_PATH = 'pages/api/auth/AuthOneTimeTokenEndpoint()'

const asyncRandomBytes = promisify(crypto.randomBytes)

export default async function AuthOneTimeTokenEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const me = await handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.VIEWER])

        const maybeIp = NODE_ENV === 'production' ? req.headers['x-real-ip'] : '0.0.0.0'
        if (maybeIp === undefined) {
          throw new ApiError(`Unresolvable IP.`, 403, true)
        }

        const valueBuffer = await asyncRandomBytes(48)

        const expiredAt = dayjs().add(5, 'minute').toDate()
        const ip = Array.isArray(maybeIp) ? maybeIp.join(', ') : maybeIp
        const userId = me.id
        const value = valueBuffer.toString('hex')

        await prisma.oneTimeToken.create({
          data: {
            expiredAt,
            ip,
            userId,
            value,
          },
        })

        res.status(200).json({
          data: {
            oneTimeToken: value,
          },
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return undefined

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
