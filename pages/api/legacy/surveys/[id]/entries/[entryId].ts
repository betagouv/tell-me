import getFileExtension from '@api/helpers/getFileExtension'
import ApiError from '@api/libs/ApiError'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import withMongoose from '@api/middlewares/withMongoose'
import withPrisma from '@api/middlewares/withPrisma'
import Survey from '@api/models/Survey'
import SurveyEntry from '@api/models/SurveyEntry'
import { USER_ROLE } from '@common/constants'
import { handleError } from '@common/helpers/handleError'
import aws from 'aws-sdk'
import mongoose, { Document } from 'mongoose'
import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'

import type { RequestWithPrisma } from '@api/types'
import type { NextApiRequest, NextApiResponse } from 'next'

const { AWS_S3_BUCKET, AWS_S3_REGION } = process.env
const ASSETS_PATH = path.join(process.cwd(), 'assets', 'private')
const ERROR_PATH = 'pages/api/legacy/surveys/[id]/entries/[entryId].ts'

const s3 = new aws.S3()

function runMiddleware(req: NextApiRequest, res: NextApiResponse, middleware: any) {
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

async function SurveyEntryEndpoint(req: RequestWithPrisma, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const authResult = handleAuth(req, res, [USER_ROLE.ADMINISTRATOR])
        if (authResult === undefined) {
          return undefined as never
        }

        const { entryId } = req.query
        if (typeof entryId !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurveyEntry = await SurveyEntry.findById(entryId).exec()
        if (maybeSurveyEntry === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        res.status(200).json({
          data: maybeSurveyEntry.toObject(),
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'DELETE':
      try {
        const authResult = handleAuth(req, res, [USER_ROLE.ADMINISTRATOR])
        if (authResult === undefined) {
          return undefined as never
        }

        const { entryId, id: surveyId } = req.query
        if (typeof entryId !== 'string' || typeof surveyId !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurvey = await Survey.findById(surveyId).exec()
        if (maybeSurvey === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurveyEntry = await SurveyEntry.findById(entryId).exec()
        if (maybeSurveyEntry === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        await maybeSurveyEntry.findByIdAndDelete(entryId)

        res.status(204).end()
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'PUT':
      try {
        const { entryId, id: surveyId, question, type } = req.query
        if (
          typeof entryId !== 'string' ||
          typeof question !== 'string' ||
          typeof surveyId !== 'string' ||
          typeof type !== 'string'
        ) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurvey = await Survey.findById(surveyId).exec()
        if (maybeSurvey === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurveyEntry: Document = await SurveyEntry.findById(entryId).exec()
        if (maybeSurveyEntry === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
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
                    mimeType: file.mimetype,
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
                  const publicUrl = `/api/asset/private/${fileName}`

                  ;(maybeSurveyEntry as any).files.push({
                    _id: fileId,
                    mimeType: file.mimetype,
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

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withMongoose(SurveyEntryEndpoint))
