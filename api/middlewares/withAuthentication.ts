import { NextApiHandler } from 'next'
import R from 'ramda'

import { USER_ROLE } from '../../common/constants'
import getJwtPayload from '../helpers/getJwtPayload'
import handleError from '../helpers/handleError'
import ApiError from '../libs/ApiError'
import OneTimeToken from '../models/OneTimeToken'
import User from '../models/User'

const ERROR_PATH = 'middlewares/withAuthentication()'

export default function withAuthentication(
  handler: NextApiHandler<Api.ResponseWithMongoose>,
  allowedRoles = [USER_ROLE.ADMINISTRATOR],
): NextApiHandler<Api.ResponseWithAuthentication> {
  return async (req, res) => {
    let userId
    try {
      if (req.query.oneTimeToken !== undefined) {
        const maybeOneTimeToken = await OneTimeToken.findOneAndDelete({
          value: req.query.oneTimeToken,
        })
        if (maybeOneTimeToken === null) {
          return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
        }

        userId = maybeOneTimeToken.user.toString()
      } else {
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
      }

      const user = await User.findById(userId).exec()
      if (user === null || !user.isActive) {
        return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
      }

      if (!allowedRoles.includes(user.role)) {
        return handleError(new ApiError(`Forbidden.`, 403, true), ERROR_PATH, res)
      }

      ;(req as Api.ResponseWithAuthentication).me = R.pick(['id'], user)

      return await handler(req, res)
    } catch (err) {
      return handleError(err, ERROR_PATH, res)
    }
  }
}
