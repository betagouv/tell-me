import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuthentication from '../../api/middlewares/withAuthentication'
import withMongoose from '../../api/middlewares/withMongoose'
import RefreshToken from '../../api/models/RefreshToken'
import { USER_ROLE } from '../../common/constants'

const ERROR_PATH = 'pages/api/RefreshTokensController()'

async function RefreshTokensController(req, res) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const refreshTokens = await RefreshToken.find().populate('user').exec()

    res.status(200).json({
      data: refreshTokens,
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withMongoose(withAuthentication(RefreshTokensController, [USER_ROLE.ADMINISTRATOR]))
