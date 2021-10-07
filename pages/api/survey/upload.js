import multer from 'multer'

import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuthentication from '../../../api/middlewares/withAuthentication'
import withMongoose from '../../../api/middlewares/withMongoose'
import Survey from '../../../api/models/Survey'
import { USER_ROLE } from '../../../common/constants'

const ERROR_PATH = 'pages/api/survey/SurveyController()'

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

async function SurveysController(req, res) {
  if (!['PUT'].includes(req.method)) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const {
      id: [id],
      type,
    } = req.query
    const maybeSurvey = await Survey.findById(id).exec()
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
      destination: `${process.cwd()}/public/survey-assets`,
      filename: (_, file, callback) => {
        callback(null, `${id}-${type}.png`)
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

export default withMongoose(withAuthentication(SurveysController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER]))
