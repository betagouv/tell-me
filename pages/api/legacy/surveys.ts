import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuth from '../../../api/middlewares/withAuth'
import withMongoose from '../../../api/middlewares/withMongoose'
import withPrisma from '../../../api/middlewares/withPrisma'
import Survey from '../../../api/models/Survey'
import { USER_ROLE } from '../../../common/constants'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/legacy/SurveysController()'

async function SurveysController(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const surveys = await Survey.find().exec()

    res.status(200).json({
      data: surveys,
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withPrisma(
  withMongoose(withAuth(SurveysController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER, USER_ROLE.VIEWER])),
)
