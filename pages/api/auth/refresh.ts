import { NextApiRequest, NextApiResponse } from 'next'
import R from 'ramda'

import getJwt from '../../../api/helpers/getJwt'
import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withMongoose from '../../../api/middlewares/withMongoose'
import RefreshToken from '../../../api/models/RefreshToken'
import User from '../../../api/models/User'
import UserConfig from '../../../api/models/UserConfig'

const ERROR_PATH = 'pages/api/auth/AuthRefreshController()'

async function AuthRefreshController(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const maybeRefreshToken = await RefreshToken.findOne({ value: req.body.refreshToken }).exec()
    if (maybeRefreshToken === null) {
      handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)

      return
    }

    const userId = maybeRefreshToken.user.toString()
    const maybeUser = await User.findById(userId).exec()
    if (maybeUser === null) {
      handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)

      return
    }

    if (!maybeUser.isActive) {
      handleError(new ApiError('Forbidden.', 403, true), ERROR_PATH, res)

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

    res.status(200).json({
      data: {
        sessionToken: sessionTokenValue,
      },
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withMongoose(AuthRefreshController)
