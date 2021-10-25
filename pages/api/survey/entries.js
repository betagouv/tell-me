import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuthentication from '../../../api/middlewares/withAuthentication'
import withMongoose from '../../../api/middlewares/withMongoose'
import SurveyEntry from '../../../api/models/SurveyEntry'
import { USER_ROLE } from '../../../common/constants'

const ERROR_PATH = 'pages/api/SurveyEntriesController()'

async function SurveyEntriesController(req, res) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const surveyEntries = await SurveyEntry.find({
      surveyId: req.query.surveyId,
    }).exec()

    res.status(200).json({
      data: surveyEntries,
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withMongoose(
  withAuthentication(SurveyEntriesController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER, USER_ROLE.VIEWER]),
)
