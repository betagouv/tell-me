import aws from 'aws-sdk'
import mongoose, { Document } from 'mongoose'
import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'

import getFileExtension from '../../../api/helpers/getFileExtension'
import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withMongoose from '../../../api/middlewares/withMongoose'
import SurveyEntry from '../../../api/models/SurveyEntry'

const { AWS_S3_BUCKET, AWS_S3_REGION } = process.env
const ASSETS_PATH = path.join(process.cwd(), 'assets', 'private')
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
    const { question, surveyEntryId, type } = req.query

    const maybeSurveyEntry: Document = await SurveyEntry.findById(surveyEntryId).exec()
    if (maybeSurveyEntry === null) {
      handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
    }

    const multerFileFilter = (_, file, callback) => {
      if (
        [
          'application/msword',
          'application/pdf',
          'application/vnd.ms-excel',
          'application/vnd.ms-powerpoint',
          'application/vnd.oasis.opendocument.presentation',
          'application/vnd.oasis.opendocument.spreadsheet',
          'application/vnd.oasis.opendocument.text',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'audio/aac',
          'audio/midi',
          'audio/mpeg',
          'audio/ogg',
          'audio/wav',
          'audio/webm',
          'audio/x-midi',
          'image/gif',
          'image/jpeg',
          'image/png',
          'image/webp',
          'video/mp4',
          'video/mpeg',
          'video/ogg',
          'video/webm',
          'video/x-msvideo',
        ].includes(file.mimetype)
      ) {
        callback(null, true)

        return
      }

      callback(null, false)
    }

    const multerStorage =
      AWS_S3_BUCKET !== undefined
        ? multerS3({
            acl: 'private',
            bucket: AWS_S3_BUCKET,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file: Express.Multer.File, callback) => {
              const fileId = new mongoose.Types.ObjectId().toString()
              const fileExtension = getFileExtension(file.originalname)
              const fileName = `${fileId}.${fileExtension}`
              const publicUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_S3_REGION}.amazonaws.com/${fileName}`

              ;(maybeSurveyEntry as any).files.push({
                _id: fileId,
                question,
                type,
                url: publicUrl,
              })
              maybeSurveyEntry.save(() => {
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
              const fileId = new mongoose.Types.ObjectId().toString()
              const fileExtension = getFileExtension(file.originalname)
              const fileName = `${fileId}.${fileExtension}`
              const publicUrl = `/api/asset/${fileName}`

              ;(maybeSurveyEntry as any).files.push({
                _id: fileId,
                question,
                type,
                url: publicUrl,
              })
              maybeSurveyEntry.save(() => {
                callback(null, fileName)
              })
            },
          })

    const upload = multer({
      fileFilter: multerFileFilter,
      storage: multerStorage,
    })

    await runMiddleware(req, res, upload.single('file'))

    res.status(204).end()
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withMongoose(SurveyUploadController)
