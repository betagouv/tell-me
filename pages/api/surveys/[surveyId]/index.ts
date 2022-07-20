import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { validateTellMeData } from '@common/helpers/validateTellMeData'
import { validateTellMeTree } from '@common/helpers/validateTellMeTree'
import { UserRole } from '@prisma/client'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/surveys/[surveyId]/index.ts'

export default async function SurveyEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.VIEWER], true)

        const { surveyId } = req.query
        if (typeof surveyId !== 'string') {
          throw new ApiError('Not found.', 404, true)
        }

        const maybeSurvey = await prisma.survey.findUnique({
          where: {
            id: surveyId,
          },
        })
        if (maybeSurvey === null) {
          throw new ApiError('Not found.', 404, true)
        }

        res.status(200).json({
          data: maybeSurvey,
          hasError: false,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return undefined

    case 'PATCH':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER])

        const { surveyId } = req.query
        if (typeof surveyId !== 'string') {
          throw new ApiError('Not found.', 404, true)
        }
        if (typeof req.body.tree !== 'undefined') {
          const treeValidation = await validateTellMeTree(req.body.tree)
          if (!treeValidation.isValid) {
            // eslint-disable-next-line no-console
            console.error(req.body.tree)
            // eslint-disable-next-line no-console
            console.error(treeValidation.errors)

            throw new ApiError('Payload `tree` is invalid.', 422, true)
          }
        }
        if (typeof req.body.data !== 'undefined') {
          const dataValidation = await validateTellMeData(req.body.data)
          if (!dataValidation.isValid) {
            // eslint-disable-next-line no-console
            console.error(req.body.data)
            // eslint-disable-next-line no-console
            console.error(dataValidation.errors)

            throw new ApiError('Payload `data` is invalid.', 422, true)
          }
        }

        const surveyCount = await prisma.survey.count({
          where: {
            id: surveyId,
          },
        })
        if (surveyCount === 0) {
          throw new ApiError('Not found.', 404, true)
        }

        const updatedSurvey = await prisma.survey.update({
          data: req.body,
          where: {
            id: surveyId,
          },
        })
        if (updatedSurvey === null) {
          throw new ApiError('Not found.', 404, true)
        }

        res.status(200).json({
          data: updatedSurvey,
          hasError: false,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return undefined

    case 'DELETE':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER])

        const { surveyId } = req.query
        if (typeof surveyId !== 'string') {
          throw new ApiError('Not found.', 404, true)
        }

        const surveyCount = await prisma.survey.count({
          where: {
            id: surveyId,
          },
        })
        if (surveyCount === 0) {
          throw new ApiError('Not found.', 404, true)
        }

        const deletedSurvey = await prisma.survey.delete({
          where: {
            id: surveyId,
          },
        })

        res.status(200).json({
          data: deletedSurvey,
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
