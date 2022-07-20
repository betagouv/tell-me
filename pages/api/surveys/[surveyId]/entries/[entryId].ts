import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { Prisma, UserRole } from '@prisma/client'
import { find, propEq, reject } from 'ramda'

import type { SurveyWithJsonTypeAndDate } from '@common/types'
import type { TellMe } from '@schemas/1.0.0/TellMe'
import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/surveys/[surveyId]/entries/[entryId].ts'

export default async function SurveyEntryIndexEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'DELETE':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER])

        const { entryId, surveyId } = req.query
        if (typeof entryId !== 'string' || typeof surveyId !== 'string') {
          throw new ApiError('Not found.', 404, true)
        }

        const survey = (await prisma.survey.findUnique({
          where: {
            id: surveyId,
          },
        })) as SurveyWithJsonTypeAndDate | null
        if (survey === null) {
          throw new ApiError('Not found.', 404, true)
        }

        const { entries: surveyEntries } = survey.data

        const surveyEntryPredicate = propEq('id', entryId)
        const surveyEntry = find<TellMe.DataEntry>(surveyEntryPredicate)(surveyEntries)
        if (!surveyEntry) {
          throw new ApiError('Not found.', 404, true)
        }

        const updatedEntries = reject<TellMe.DataEntry>(surveyEntryPredicate)(surveyEntries)
        const updatedData: TellMe.Data = {
          ...survey.data,
          entries: updatedEntries,
        }

        const updatedSurvey = await prisma.survey.update({
          data: {
            data: updatedData as Prisma.InputJsonValue,
          },
          where: {
            id: surveyId,
          },
        })

        res.status(200).json({
          data: updatedSurvey,
          hasError: false,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return undefined

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
