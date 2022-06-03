import handleError from '../../../../api/helpers/handleError'
import ApiError from '../../../../api/libs/ApiError'
import withAuth from '../../../../api/middlewares/withAuth'
import withMongoose from '../../../../api/middlewares/withMongoose'
import withPrisma from '../../../../api/middlewares/withPrisma'
import SurveyEntry from '../../../../api/models/SurveyEntry'
import { USER_ROLE } from '../../../../common/constants'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/legacy/survey/SurveyEntriesController()'

async function SurveyEntriesController(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const { surveyId } = req.query

    const surveyEntries = await SurveyEntry.find({
      survey: surveyId,
    }).exec()

    res.status(200).json({
      data: surveyEntries,
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withPrisma(
  withMongoose(withAuth(SurveyEntriesController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER, USER_ROLE.VIEWER], true)),
)
