import multer from 'multer'
import path from 'path'

import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuth from '../../../api/middlewares/withAuth'
import withMongoose from '../../../api/middlewares/withMongoose'
import Survey from '../../../api/models/Survey'
import { USER_ROLE } from '../../../common/constants'

const ASSETS_PATH = path.join(process.cwd(), 'assets')
const ERROR_PATH = 'pages/api/survey/SurveyUploadController()'

function runMiddleware(req, res, middleware) {
  return new Promise((resolve, reject) => {
    middleware(req, res, result => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

async function SurveyUploadController(req, res) {
  if (!['PUT'].includes(req.method)) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const {
      surveyId: [surveyId],
      type,
    } = req.query

    const maybeSurvey = await Survey.findById(surveyId).exec()
    if (maybeSurvey === null) {
      handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
    }

    const multerFileFilter = (_, file, callback) => {
      if (file.mimetype === 'image/png') {
        callback(null, true)

        return
      }

      callback(null, false)
    }
    const multerStorage = multer.diskStorage({
      destination: ASSETS_PATH,
      filename: (_, file, callback) => {
        callback(null, `${surveyId}-${type}.png`)
      },
    })
    const upload = multer({
      fileFilter: multerFileFilter,
      storage: multerStorage,
    })

    await runMiddleware(req, res, upload.single(type))

    res.status(204).end()
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withMongoose(withAuth(SurveyUploadController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER]))
