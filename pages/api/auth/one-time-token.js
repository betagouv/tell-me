import crypto from 'crypto'
import { promisify } from 'util'

import handleError from '../../../api/helpers/handleError.ts'
import ApiError from '../../../api/libs/ApiError'
import withAuthentication from '../../../api/middlewares/withAuthentication'
import withMongoose from '../../../api/middlewares/withMongoose'
import OneTimeToken from '../../../api/models/OneTimeToken'
import { USER_ROLE } from '../../../common/constants'

const ERROR_PATH = 'pages/api/auth/AuthOneTimeTokenController()'
const { NODE_ENV } = process.env

const asyncRandomBytes = promisify(crypto.randomBytes)

async function AuthOneTimeTokenController(req, res) {
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
    const value = valueBuffer.toString('hex')
    const newOneTimeTokenData = {
      ip: maybeIp,
      user: req.me.id,
      value,
    }

    const newToken = new OneTimeToken(newOneTimeTokenData)
    await newToken.save()

    res.status(200).json({
      data: {
        oneTimeToken: value,
      },
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withMongoose(
  withAuthentication(AuthOneTimeTokenController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER, USER_ROLE.VIEWER]),
)
