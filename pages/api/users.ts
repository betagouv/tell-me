import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuth from '../../api/middlewares/withAuth'
import withPrisma from '../../api/middlewares/withPrisma'
import { USER_ROLE } from '../../common/constants'

import type { RequestWithAuth } from '../../api/types'
import type { NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/auth/UsersController()'

async function UsersController(req: RequestWithAuth, res: NextApiResponse) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const users = await req.db.user.findMany()

    res.status(200).json({
      data: users,
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withPrisma(withAuth(UsersController, [USER_ROLE.ADMINISTRATOR]))
