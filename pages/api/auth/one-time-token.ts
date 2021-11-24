import crypto from 'crypto'
import dayjs from 'dayjs'
import { NextApiResponse } from 'next'
import { promisify } from 'util'

import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuth from '../../../api/middlewares/withAuth'
import withMongoose from '../../../api/middlewares/withMongoose'
import withPrisma from '../../../api/middlewares/withPrisma'
import { RequestWithAuth } from '../../../api/types'
import { USER_ROLE } from '../../../common/constants'

const ERROR_PATH = 'pages/api/auth/AuthOneTimeTokenController()'
const { NODE_ENV } = process.env

const asyncRandomBytes = promisify(crypto.randomBytes)

async function AuthOneTimeTokenController(req: RequestWithAuth, res: NextApiResponse) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const maybeIp = NODE_ENV === 'production' ? req.headers['x-real-ip'] : '0.0.0.0'
    if (maybeIp === undefined) {
      handleError(new ApiError(`Unresolvable IP.`, 403, true), ERROR_PATH, res)

      return
    }

    const valueBuffer = await asyncRandomBytes(48)

    const expiredAt = dayjs().add(5, 'minute').toDate()
    const ip = Array.isArray(maybeIp) ? maybeIp.join(', ') : maybeIp
    const userId = req.newMe.id
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
}

export default withPrisma(
  withMongoose(withAuth(AuthOneTimeTokenController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER, USER_ROLE.VIEWER])),
)
