import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuthentication from '../../../api/middlewares/withAuthentication'
import withMongoose from '../../../api/middlewares/withMongoose'
import Survey from '../../../api/models/Survey'
import { USER_ROLE } from '../../../common/constants'

const ERROR_PATH = 'pages/api/survey/SurveyController()'

async function SurveyController(req, res) {
  if (!['DELETE', 'GET', 'PATCH', 'POST'].includes(req.method)) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'GET':
      try {
        const maybeSurvey = await Survey.findById(req.query.id).exec()
        if (maybeSurvey === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        res.status(200).json({
          data: maybeSurvey.toObject(),
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'POST':
      try {
        const newSurvey = new Survey(req.body)
        await newSurvey.save()

        res.status(201).json({
          data: newSurvey.toObject(),
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'PATCH':
      try {
        const maybeSurvey = await Survey.findById(req.query.id).exec()
        if (maybeSurvey === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        maybeSurvey.set(req.body)
        const updatedSurvey = await maybeSurvey.save()

        res.status(200).json({
          data: updatedSurvey.toObject(),
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'DELETE':
      try {
        const maybeSurvey = await Survey.findById(req.query.id).exec()
        if (maybeSurvey === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        await Survey.findByIdAndDelete(req.query.id)

        res.status(204).end()
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }
  }
}

export default withMongoose(withAuthentication(SurveyController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER]))
