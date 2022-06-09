import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'
import crypto from 'crypto'
import dayjs from 'dayjs'
import { NextApiHandler, NextApiResponse } from 'next'
import { promisify } from 'util'

import ApiError from '../../../api/libs/ApiError'
import withAuth from '../../../api/middlewares/withAuth'
import withPrisma from '../../../api/middlewares/withPrisma'
import { RequestWithAuth } from '../../../api/types'

const ERROR_PATH = 'pages/api/auth/AuthOneTimeTokenEndpoint()'
const { NODE_ENV } = process.env

const asyncRandomBytes = promisify(crypto.randomBytes)

async function AuthOneTimeTokenEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const maybeIp = NODE_ENV === 'production' ? req.headers['x-real-ip'] : '0.0.0.0'
        if (maybeIp === undefined) {
          return handleError(new ApiError(`Unresolvable IP.`, 403, true), ERROR_PATH, res)
        }

        const valueBuffer = await asyncRandomBytes(48)

        const expiredAt = dayjs().add(5, 'minute').toDate()
        const ip = Array.isArray(maybeIp) ? maybeIp.join(', ') : maybeIp
        const userId = req.me.id
        const value = valueBuffer.toString('hex')

        await req.db.oneTimeToken.create({
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
        handleError(err, ERROR_PATH, res)
      }

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(
  withAuth(AuthOneTimeTokenEndpoint as NextApiHandler, [UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.VIEWER]),
)
