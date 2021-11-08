import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuthentication from '../../api/middlewares/withAuthentication'
import withMongoose from '../../api/middlewares/withMongoose'
import User from '../../api/models/User'
import { USER_ROLE } from '../../common/constants'

const ERROR_PATH = 'pages/api/auth/UsersController()'

async function UsersController(req, res) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const users = await User.find().exec()

    res.status(200).json({
      data: users,
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withMongoose(withAuthentication(UsersController, [USER_ROLE.ADMINISTRATOR]))
