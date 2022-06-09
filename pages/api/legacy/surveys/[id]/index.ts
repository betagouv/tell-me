import getFileExtension from '@api/helpers/getFileExtension'
import ApiError from '@api/libs/ApiError'
import withAuth from '@api/middlewares/withAuth'
import withMongoose from '@api/middlewares/withMongoose'
import withPrisma from '@api/middlewares/withPrisma'
import Survey from '@api/models/Survey'
import SurveyEntry from '@api/models/SurveyEntry'
import { USER_ROLE } from '@common/constants'
import { handleError } from '@common/helpers/handleError'
import { Document } from 'mongoose'
import multer from 'multer'
import path from 'path'

import type { NextApiRequest, NextApiResponse } from 'next'

const ASSETS_PATH = path.join(process.cwd(), 'assets')
const ERROR_PATH = 'pages/api/legacy/surveys/[id]/index.ts'

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

async function LegacySurveyEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurvey = await Survey.findById(id).exec()
        if (maybeSurvey === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        res.status(200).json({
          data: maybeSurvey.toObject(),
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'PATCH':
      try {
        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurvey = await Survey.findById(id).exec()
        if (maybeSurvey === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurveyData = maybeSurvey.toObject()

        maybeSurvey.set({
          ...maybeSurveyData,
          ...req.body,
          props: {
            ...maybeSurveyData.props,
            ...(req.body.props || {}),
          },
        })
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
        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurvey = await Survey.findById(id).exec()
        if (maybeSurvey === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        await SurveyEntry.deleteMany({
          survey: id,
        })
        await Survey.findByIdAndDelete(id)

        res.status(204).end()
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'PUT':
      try {
        const { id, type } = req.query
        if (typeof id !== 'string' || typeof type !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurvey: Document = await Survey.findById(id).exec()
        if (maybeSurvey === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const multerFileFilter = (_, file, callback) => {
          if (['image/jpg', 'image/png'].includes(file.mimetype)) {
            callback(null, true)

            return
          }

          callback(null, false)
        }

        const multerStorage = multer.diskStorage({
          destination: ASSETS_PATH,
          filename: (_, file: Express.Multer.File, callback) => {
            const fileExtension = getFileExtension(file.originalname)
            const fileName = `${id}-${type}.${fileExtension}`
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

        await runMiddleware(req, res, upload.single(String(type)))

        res.status(204).end()
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withMongoose(withAuth(LegacySurveyEndpoint, [USER_ROLE.ADMINISTRATOR])))
