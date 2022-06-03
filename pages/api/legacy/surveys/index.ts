import ApiError from '@api/libs/ApiError'
import withAuth from '@api/middlewares/withAuth'
import withMongoose from '@api/middlewares/withMongoose'
import withPrisma from '@api/middlewares/withPrisma'
import Survey from '@api/models/Survey'
import { USER_ROLE } from '@common/constants'
import { handleError } from '@common/helpers/handleError'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/legacy/surveys/index.ts'

async function LegacySurveyIndexEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const surveys = await Survey.find().exec()

        res.status(200).json({
          data: surveys,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'POST':
      try {
        const newSurvey = new Survey(req.body)
        await newSurvey.save()

        res.status(201).json({
          data: newSurvey.toObject(),
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withMongoose(withAuth(LegacySurveyIndexEndpoint, [USER_ROLE.ADMINISTRATOR])))
