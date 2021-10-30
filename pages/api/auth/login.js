import bcrypt from 'bcryptjs'
import R from 'ramda'

import getJwt from '../../../api/helpers/getJwt'
import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withMongoose from '../../../api/middlewares/withMongoose'
import Token from '../../../api/models/Token'
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
    const sessionToken = await getJwt(tokenPayload)

    // Delete all existing Refresh JWT for the authenticated user client
    await Token.deleteMany({
      ip: maybeIp,
      user: maybeUser.id,
    }).exec()

    const refreshToken = await getJwt(tokenPayload, maybeIp)

    // Save the new Refresh JWT for the authenticated user client
    const newTokenData = {
      ip: maybeIp,
      user: maybeUser.id,
      value: refreshToken,
    }
    const newToken = new Token(newTokenData)
    await newToken.save()

    res.status(200).json({
      data: {
        refreshToken,
        sessionToken,
      },
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withMongoose(AuthLoginController)
