import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuth from '../../../api/middlewares/withAuth'
import withMongoose from '../../../api/middlewares/withMongoose'
import User from '../../../api/models/User'
import { USER_ROLE } from '../../../common/constants'

const ERROR_PATH = 'pages/api/user/UserController()'

async function UserController(req, res) {
  if (!['GET', 'PATCH'].includes(req.method)) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'GET':
      try {
        const { userId } = req.query

        const maybeUser = await User.findById(userId).exec()
        if (maybeUser === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        res.status(200).json({
          data: maybeUser.toObject(),
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'PATCH':
      try {
        const { userId } = req.query

        const maybeUser = await User.findById(userId).exec()
        if (maybeUser === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        maybeUser.set(req.body)
        const updatedUser = await maybeUser.save()

        res.status(200).json({
          data: updatedUser.toObject(),
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }
  }
}

export default withMongoose(withAuth(UserController, [USER_ROLE.ADMINISTRATOR]))
