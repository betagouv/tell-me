import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuth from '../../api/middlewares/withAuth'
import withPrisma from '../../api/middlewares/withPrisma'
import { USER_ROLE } from '../../common/constants'

import type { RequestWithAuth } from '../../api/types'
import type { NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/RefreshTokensController()'

async function RefreshTokensController(req: RequestWithAuth, res: NextApiResponse) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const refreshTokens = await req.db.refreshToken.findMany({
      select: {
        expiredAt: true,
        id: true,
        ip: true,
        user: {
          select: {
            email: true,
            firstName: true,
            id: true,
            lastName: true,
          },
        },
      },
    })

    res.status(200).json({
      data: refreshTokens,
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withPrisma(withAuth(RefreshTokensController, [USER_ROLE.ADMINISTRATOR]))
