import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { generateTellMeData } from '@app/helpers/generateTellMeData'
import { SurveyEditorManager } from '@app/libs/SurveyEditorManager'
import { getDayjs } from '@common/helpers/getDayjs'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { isPojo } from '@common/helpers/isPojo'
import { validateTellMeData } from '@common/helpers/validateTellMeData'
import cuid from 'cuid'

import type { TellMe } from '@schemas/1.0.0/TellMe'
import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/surveys/[id]/index.ts'

export default async function SurveyEntryIndexEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        const { id } = req.query
        if (typeof id !== 'string') {
          throw new ApiError('Not found.', 404, true)
        }
        if (!isPojo(req.body.formData)) {
          throw new ApiError('Payload `formData` is invalid.', 422, true)
        }
        if (typeof req.body.openedAt !== 'string') {
          throw new ApiError('Payload `openedAt` is invalid.', 422, true)
        }

        const survey = await prisma.survey.findUnique({
          where: {
            id,
          },
        })
        if (survey === null) {
          throw new ApiError('Not found.', 404, true)
        }

        const dayjs = getDayjs()
        const {
          data: { entries },
          tree,
        } = survey as unknown as {
          data: TellMe.Data
          tree: TellMe.Tree
        }

        const entryId = cuid()
        const submittedAt = dayjs.utc().toISOString()
        const surveyManager = new SurveyEditorManager(tree.children)

        const newData: any = generateTellMeData({
          entries,
          entryId,
          formData: req.body.formData,
          language: tree.data.language,
          openedAt: req.body.openedAt,
          submittedAt,
          surveyId: tree.id,
          surveyManager,
          title: tree.data.title,
        })
        const dataValidation = await validateTellMeData(newData)
        if (!dataValidation.isValid) {
          // eslint-disable-next-line no-console
          console.error(newData)
          // eslint-disable-next-line no-console
          console.error(dataValidation.errors)

          throw new ApiError('Data validation did not pass.', 422)
        }

        const updatedSurvey = await prisma.survey.update({
          data: {
            data: newData,
          },
          where: {
            id,
          },
        })
        if (updatedSurvey === null) {
          throw new ApiError('Not found.', 404, true)
        }

        res.status(200).json({
          data: updatedSurvey,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return undefined

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
