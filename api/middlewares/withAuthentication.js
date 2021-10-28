import R from 'ramda'

import { USER_ROLE } from '../../common/constants'
import getJwtPayload from '../helpers/getJwtPayload'
import handleError from '../helpers/handleError'
import ApiError from '../libs/ApiError'
import User from '../models/User'

const ERROR_PATH = 'middlewares/withAuthentication()'

export default function withAuthentication(handler, allowedRoles = [USER_ROLE.ADMINISTRATOR]) {
  return async (req, res) => {
    try {
      const authorizationHeader = req.headers.authorization

      if (authorizationHeader === undefined || !/^Bearer .+$/.test(authorizationHeader)) {
        return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
      }

      const sessionToken = /^Bearer (.+)$/.exec(authorizationHeader)[1]
      const maybeTokenPayload = await getJwtPayload(sessionToken)
      if (maybeTokenPayload === null) {
        return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
      }

      const userId = maybeTokenPayload._id
      const user = await User.findById(userId).exec()
      if (user === null || !user.isActive) {
        return handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)
      }

      if (!allowedRoles.includes(user.role)) {
        return handleError(new ApiError(`Forbidden.`, 403, true), ERROR_PATH, res)
      }

      req.me = R.pick(['id'], user)

      return handler(req, res)
    } catch (err) {
      return handleError(err, ERROR_PATH, res)
    }
  }
}
