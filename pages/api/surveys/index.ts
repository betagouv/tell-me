import { ApiError } from '@api/libs/ApiError'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { withPrisma } from '@api/middlewares/withPrisma'
import { handleError } from '@common/helpers/handleError'
import { validateTellMeData } from '@common/helpers/validateTellMeData'
import { validateTellMeTree } from '@common/helpers/validateTellMeTree'
import { UserRole } from '@prisma/client'

import type { RequestWithPrisma } from '@api/types'
import type { NextApiHandler, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/surveys/index.ts'

async function SurveyIndexEndpoint(req: RequestWithPrisma, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const authResult = handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.VIEWER], true)
        if (authResult === undefined) {
          return undefined
        }

        const surveys = await req.db.survey.findMany({
          orderBy: {
            updatedAt: 'desc',
          },
        })

        res.status(200).json({
          data: surveys,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return undefined

    case 'POST':
      try {
        const authResult = handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER])
        if (authResult === undefined) {
          // eslint-disable-next-line consistent-return
          return undefined
        }

        const treeValidation = await validateTellMeTree(req.body.tree)
        if (!treeValidation.isValid) {
          // eslint-disable-next-line no-console
          console.error(treeValidation.errors)

          return handleError(new ApiError('Payload `tree` is invalid.', 422, true), ERROR_PATH, res)
        }
        const dataValidation = await validateTellMeData(req.body.data)
        if (!dataValidation.isValid) {
          // eslint-disable-next-line no-console
          console.error(dataValidation.errors)

          return handleError(new ApiError('Payload `data` is invalid.', 422, true), ERROR_PATH, res)
        }

        const newSurvey = await req.db.survey.create({
          data: req.body,
        })

        res.status(201).json({
          data: newSurvey,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return undefined

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withPrisma(SurveyIndexEndpoint as NextApiHandler))
