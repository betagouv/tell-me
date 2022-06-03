import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuth from '../../../api/middlewares/withAuth'
import withPrisma from '../../../api/middlewares/withPrisma'
import { USER_ROLE } from '../../../common/constants'

import type { RequestWithAuth } from '../../../api/types'
import type { NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/survey/SurveyController()'

async function SurveyController(req: RequestWithAuth, res: NextApiResponse) {
  if (req.method === undefined || !['DELETE', 'GET', 'PATCH', 'POST'].includes(String(req.method))) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'GET':
      try {
        const { surveyId } = req.query

        const maybeSurvey = await req.db.survey.findUnique({
          where: {
            id: String(surveyId),
          },
        })
        if (maybeSurvey === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        res.status(200).json({
          data: maybeSurvey,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'POST':
      try {
        const newSurvey = await req.db.survey.create({
          data: req.body,
        })

        res.status(201).json({
          data: newSurvey,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'PATCH':
      try {
        const { surveyId } = req.query

        const surveyCount = await req.db.survey.count({
          where: {
            id: String(surveyId),
          },
        })
        if (surveyCount === 0) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const updatedSurvey = await req.db.survey.update({
          data: req.body,
          where: {
            id: String(surveyId),
          },
        })
        if (updatedSurvey === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
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
        const { surveyId } = req.query

        const surveyCount = await req.db.survey.count({
          where: {
            id: String(surveyId),
          },
        })
        if (surveyCount === 0) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        await req.db.survey.delete({
          where: {
            id: String(surveyId),
          },
        })

        res.status(204).end()
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }
  }
}

export default withPrisma(withAuth(SurveyController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER]))
