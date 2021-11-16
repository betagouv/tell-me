import aws from 'aws-sdk'
import { Document } from 'mongoose'
import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'

import getFileExtension from '../../../api/helpers/getFileExtension'
import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuth from '../../../api/middlewares/withAuth'
import withMongoose from '../../../api/middlewares/withMongoose'
import Survey from '../../../api/models/Survey'
import { USER_ROLE } from '../../../common/constants'

const { AWS_S3_BUCKET, AWS_S3_REGION } = process.env
const ASSETS_PATH = path.join(process.cwd(), 'assets')
const ERROR_PATH = 'pages/api/survey/SurveyUploadController()'

const s3 = new aws.S3()

function runMiddleware(req: any, res: any, middleware: any) {
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

    const maybeSurvey: Document = await Survey.findById(surveyId).exec()
    if (maybeSurvey === null) {
      handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
    }

    const multerFileFilter = (_, file, callback) => {
      if (['image/jpg', 'image/png'].includes(file.mimetype)) {
        callback(null, true)

        return
      }

      callback(null, false)
    }

    const multerStorage =
      AWS_S3_BUCKET !== undefined
        ? multerS3({
            acl: 'public-read',
            bucket: AWS_S3_BUCKET,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file: Express.Multer.File, callback) => {
              const fileExtension = getFileExtension(file.originalname)
              const fileName = `${surveyId}-${type}.${fileExtension}`
              const publicUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_S3_REGION}.amazonaws.com/${fileName}`

              maybeSurvey.set({
                props: {
                  ...(maybeSurvey.toObject() as any).props,
                  [`${type}Url`]: publicUrl,
                },
              })
              maybeSurvey.save(() => {
                callback(null, fileName)
              })
            },
            metadata: (req, file: Express.Multer.File, callback) => {
              callback(null, {
                fieldName: file.fieldname,
              })
            },
            s3,
          })
        : multer.diskStorage({
            destination: ASSETS_PATH,
            filename: (_, file: Express.Multer.File, callback) => {
              const fileExtension = getFileExtension(file.originalname)
              const fileName = `${surveyId}-${type}.${fileExtension}`
              const publicUrl = `/api/asset/${fileName}`

              maybeSurvey.set({
                props: {
                  ...(maybeSurvey.toObject() as any).props,
                  [`${type}Url`]: publicUrl,
                },
              })
              maybeSurvey.save(() => {
                callback(null, fileName)
              })
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
