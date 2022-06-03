import ApiError from '@api/libs/ApiError'
import withPrisma from '@api/middlewares/withPrisma'
import generateTellMeData from '@app/helpers/generateTellMeData'
import SurveyEditorManager from '@app/libs/SurveyEditorManager'
import getDayjs from '@common/helpers/getDayjs'
import { handleError } from '@common/helpers/handleError'
import { isPojo } from '@common/helpers/isPojo'
import { validateTellMeData } from '@common/helpers/validateTellMeData'

import type { RequestWithPrisma } from '@api/types'
import type TellMe from '@schemas/1.0.0/TellMe'
import type { NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/surveys/[id]/index.ts'

async function SurveyEntryIndexEndpoint(req: RequestWithPrisma, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }
        if (!isPojo(req.body.formData)) {
          return handleError(new ApiError('Payload `formData` is invalid.', 422, true), ERROR_PATH, res)
        }
        if (typeof req.body.openedAt !== 'string') {
          return handleError(new ApiError('Payload `openedAt` is invalid.', 422, true), ERROR_PATH, res)
        }

        const survey = await req.db.survey.findUnique({
          where: {
            id,
          },
        })
        if (survey === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const dayjs = getDayjs()
        const {
          data: { entries },
          tree,
        } = (survey as unknown) as {
          data: TellMe.Data
          tree: TellMe.Tree
        }

        const submittedAt = dayjs.utc().toISOString()
        const surveyManager = new SurveyEditorManager(tree.children)

        const newData: any = generateTellMeData({
          entries,
          formData: req.body.formData,
          id: tree.id,
          language: tree.data.language,
          openedAt: req.body.openedAt,
          submittedAt,
          surveyManager,
          title: tree.data.title,
        })
        const dataValidation = await validateTellMeData(newData)
        if (!dataValidation.isValid) {
          // eslint-disable-next-line no-console
          console.error(newData)
          // eslint-disable-next-line no-console
          console.error(dataValidation.errors)

          return handleError(new ApiError('Data validation did not pass.', 500), ERROR_PATH, res)
        }

        const updatedSurvey = await req.db.survey.update({
          data: {
            data: newData,
          },
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

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(SurveyEntryIndexEndpoint)
