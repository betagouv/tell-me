import bcrypt from 'bcryptjs'
import R from 'ramda'

import getJwt from '../../../api/helpers/getJwt'
import handleError from '../../../api/helpers/handleError.ts'
import ApiError from '../../../api/libs/ApiError'
import withMongoose from '../../../api/middlewares/withMongoose'
import RefreshToken from '../../../api/models/RefreshToken'
import User from '../../../api/models/User'
import UserConfig from '../../../api/models/UserConfig'

const ERROR_PATH = 'pages/api/auth/AuthLoginController()'
const { NODE_ENV } = process.env

async function AuthLoginController(req, res) {
  if (req.method !== 'POST') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const maybeUser = await User.findOne({ email: req.body.email }).select('+password').exec()
    if (maybeUser === null) {
      handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)

      return
    }

    const matchPassword = await bcrypt.compare(req.body.password, maybeUser.password)
    if (!matchPassword) {
      handleError(new ApiError('Unauthorized.', 401, true), ERROR_PATH, res)

      return
    }
    if (!maybeUser.isActive) {
      handleError(new ApiError('Forbidden.', 403, true), ERROR_PATH, res)

      return
    }

    const maybeIp = NODE_ENV === 'production' ? req.headers['x-real-ip'] : '0.0.0.0'
    if (maybeIp === undefined) {
      handleError(new ApiError(`Unresolvable IP.`, 403, true), ERROR_PATH, res)

      return
    }

    const userConfig = await UserConfig.findOne({
      user: maybeUser.id,
    })
    const tokenPayload = {
      ...R.pick(['_id', 'email', 'role'], maybeUser),
      ...R.pick(['locale'], userConfig),
    }
    const sessionTokenValue = await getJwt(tokenPayload)

    // Delete all existing Refresh JWT for the authenticated user client
    await RefreshToken.deleteMany({
      ip: maybeIp,
      user: maybeUser.id,
    }).exec()

    const refreshTokenValue = await getJwt(tokenPayload, maybeIp)
    const newRefreshTokenData = {
      ip: maybeIp,
      user: maybeUser.id,
      value: refreshTokenValue,
    }

    // Save the new Refresh JWT for the authenticated user client
    const newRefreshToken = new RefreshToken(newRefreshTokenData)
    await newRefreshToken.save()

    res.status(200).json({
      data: {
        refreshToken: refreshTokenValue,
        sessionToken: sessionTokenValue,
      },
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withMongoose(AuthLoginController)
