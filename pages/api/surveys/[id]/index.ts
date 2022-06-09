import ApiError from '@api/libs/ApiError'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import withPrisma from '@api/middlewares/withPrisma'
import { handleError } from '@common/helpers/handleError'
import { validateTellMeData } from '@common/helpers/validateTellMeData'
import { validateTellMeTree } from '@common/helpers/validateTellMeTree'
import { UserRole } from '@prisma/client'

import type { RequestWithAuth } from '@api/types'
import type { NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/surveys/[id]/index.ts'

async function SurveyEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const authResult = handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.VIEWER], true)
        if (authResult === undefined) {
          return undefined as never
        }

        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeSurvey = await req.db.survey.findUnique({
          where: {
            id,
          },
        })
        if (maybeSurvey === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        res.status(200).json({
          data: maybeSurvey,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'PATCH':
      try {
        const authResult = handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER])
        if (authResult === undefined) {
          return undefined as never
        }

        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }
        if (typeof req.body.tree !== 'undefined') {
          const treeValidation = await validateTellMeTree(req.body.tree)
          if (!treeValidation.isValid) {
            // eslint-disable-next-line no-console
            console.error(req.body.tree)
            // eslint-disable-next-line no-console
            console.error(treeValidation.errors)

            return handleError(new ApiError('Payload `tree` is invalid.', 422, true), ERROR_PATH, res)
          }
        }
        if (typeof req.body.data !== 'undefined') {
          const dataValidation = await validateTellMeData(req.body.data)
          if (!dataValidation.isValid) {
            // eslint-disable-next-line no-console
            console.error(req.body.data)
            // eslint-disable-next-line no-console
            console.error(dataValidation.errors)

            return handleError(new ApiError('Payload `data` is invalid.', 422, true), ERROR_PATH, res)
          }
        }

        const surveyCount = await req.db.survey.count({
          where: {
            id,
          },
        })
        if (surveyCount === 0) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const updatedSurvey = await req.db.survey.update({
          data: req.body,
          where: {
            id,
          },
        })
        if (updatedSurvey === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        res.status(200).json({
          data: updatedSurvey,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'DELETE':
      try {
        const authResult = handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER])
        if (authResult === undefined) {
          return undefined as never
        }

        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const surveyCount = await req.db.survey.count({
          where: {
            id,
          },
        })
        if (surveyCount === 0) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        await req.db.survey.delete({
          where: {
            id,
          },
        })

        res.status(204).end()
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(SurveyEndpoint)
