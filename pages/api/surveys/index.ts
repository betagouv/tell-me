import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { validateTellMeData } from '@common/helpers/validateTellMeData'
import { validateTellMeTree } from '@common/helpers/validateTellMeTree'
import { UserRole } from '@prisma/client'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/surveys/index.ts'

export default async function SurveyIndexEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.VIEWER], true)

        const surveys = await prisma.survey.findMany({
          orderBy: {
            updatedAt: 'desc',
          },
        })

        res.status(200).json({
          data: surveys,
          hasError: false,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return

    case 'POST':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER])

        const treeValidation = await validateTellMeTree(req.body.tree)
        if (!treeValidation.isValid) {
          // eslint-disable-next-line no-console
          console.error(treeValidation.errors)

          throw new ApiError('Payload `tree` is invalid.', 422, true)
        }
        const dataValidation = await validateTellMeData(req.body.data)
        if (!dataValidation.isValid) {
          // eslint-disable-next-line no-console
          console.error(dataValidation.errors)

          throw new ApiError('Payload `data` is invalid.', 422, true)
        }

        const newSurvey = await prisma.survey.create({
          data: req.body,
        })

        res.status(201).json({
          data: newSurvey,
          hasError: false,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
