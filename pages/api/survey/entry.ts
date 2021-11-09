import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuth from '../../../api/middlewares/withAuth'
import withMongoose from '../../../api/middlewares/withMongoose'
import SurveyEntry from '../../../api/models/SurveyEntry'
import { USER_ROLE } from '../../../common/constants'

const ERROR_PATH = 'pages/api/survey/SurveyEntryController()'

async function SurveyEntryController(req, res) {
  if (!['DELETE', 'GET', 'PATCH', 'POST'].includes(req.method)) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'GET':
      withAuth(async () => {
        try {
          const { surveyEntryId } = req.query

          const maybeSurveyEntry = await SurveyEntry.findById(surveyEntryId).exec()
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
      withAuth(async () => {
        try {
          const { surveyEntryId } = req.query

          const maybeSurveyEntry = await SurveyEntry.findById(surveyEntryId).exec()
          if (maybeSurveyEntry === null) {
            handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
          }

          await maybeSurveyEntry.findByIdAndDelete(surveyEntryId)

          res.status(204).end()
        } catch (err) {
          handleError(err, ERROR_PATH, res)
        }
      }, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER])
  }
}

export default withMongoose(SurveyEntryController)
