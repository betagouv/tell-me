import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuthentication from '../../api/middlewares/withAuthentication'
import withMongoose from '../../api/middlewares/withMongoose'
import Survey from '../../api/models/Survey'
import { USER_ROLE } from '../../common/constants'

const ERROR_PATH = 'pages/api/auth/UsersController()'

async function SurveysController(req, res) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const surveys = await Survey.find().exec()

    res.status(200).json({
      data: surveys,
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withMongoose(
  withAuthentication(SurveysController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER, USER_ROLE.VIEWER]),
)
