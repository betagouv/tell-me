import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuthentication from '../../../api/middlewares/withAuthentication'
import withMongoose from '../../../api/middlewares/withMongoose'
import SurveyEntry from '../../../api/models/SurveyEntry'
import { USER_ROLE } from '../../../common/constants'

const ERROR_PATH = 'pages/api/survey-entry/SurveyEntryController()'

async function SurveyEntryController(req, res) {
  if (!['DELETE', 'GET', 'PATCH', 'POST'].includes(req.method)) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'GET':
      withAuthentication(async () => {
        try {
          const maybeSurveyEntry = await SurveyEntry.findById(req.query.id).exec()
          if (maybeSurveyEntry === null) {
            handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
          }

          res.status(200).json({
            data: maybeSurveyEntry.toObject(),
          })
        } catch (err) {
          handleError(err, ERROR_PATH, res)
        }
      }, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER, USER_ROLE.VIEWER])

      return

    case 'POST':
      try {
        const newSurveyEntry = new SurveyEntry(req.body)
        await newSurveyEntry.save()

        res.status(201).json({
          data: newSurveyEntry.toObject(),
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'DELETE':
      withAuthentication(async () => {
        try {
          const maybeSurveyEntry = await SurveyEntry.findById(req.query.id).exec()
          if (maybeSurveyEntry === null) {
            handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
          }

          await maybeSurveyEntry.findByIdAndDelete(req.query.id)

          res.status(204).end()
        } catch (err) {
          handleError(err, ERROR_PATH, res)
        }
      }, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER])
  }
}

export default withMongoose(SurveyEntryController)