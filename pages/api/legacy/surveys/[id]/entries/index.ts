import ApiError from '@api/libs/ApiError'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import withMongoose from '@api/middlewares/withMongoose'
import withPrisma from '@api/middlewares/withPrisma'
import Survey from '@api/models/Survey'
import SurveyEntry from '@api/models/SurveyEntry'
import { RequestWithPrisma } from '@api/types'
import { USER_ROLE } from '@common/constants'
import { handleError } from '@common/helpers/handleError'

import type { NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/legacy/surveys/[id]/entries/index.ts'

async function LegacySurveyEntryListEndpoint(req: RequestWithPrisma, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const authResult = handleAuth(req, res, [USER_ROLE.ADMINISTRATOR])
        if (authResult === undefined) {
          return
        }

        const { id: surveyId } = req.query
        if (typeof surveyId !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurvey = await Survey.findById(surveyId).exec()
        if (maybeSurvey === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const surveyEntries = await SurveyEntry.find({
          survey: surveyId,
        }).exec()

        res.status(200).json({
          data: surveyEntries,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'POST':
      try {
        const { id: surveyId } = req.query
        if (typeof surveyId !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurvey = await Survey.findById(surveyId).exec()
        if (maybeSurvey === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const newSurveyEntry = new SurveyEntry(req.body)
        await newSurveyEntry.save()

        res.status(201).json({
          data: newSurveyEntry.toObject(),
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withMongoose(LegacySurveyEntryListEndpoint))
