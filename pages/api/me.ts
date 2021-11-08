import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuthentication from '../../api/middlewares/withAuthentication'
import withMongoose from '../../api/middlewares/withMongoose'
import UserConfig from '../../api/models/UserConfig'
import { USER_ROLE } from '../../common/constants'

const ERROR_PATH = 'pages/api/UserConfigController()'

async function UserConfigController(req, res) {
  if (!['GET', 'PATCH'].includes(req.method)) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'GET':
      try {
        const userId = req.me.id

        const userConfig = await UserConfig.findOne({
          user: userId,
        }).exec()

        res.status(200).json({
          data: userConfig.toObject(),
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'PATCH':
      try {
        const userId = req.me.id

        const userConfig = await UserConfig.findOne({
          user: userId,
        }).exec()

        userConfig.set(req.body)
        const updatedUserConfig = await userConfig.save()

        res.status(200).json({
          data: updatedUserConfig.toObject(),
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }
  }
}

export default withMongoose(
  withAuthentication(UserConfigController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER, USER_ROLE.VIEWER]),
)
