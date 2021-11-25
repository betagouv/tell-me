import { NextApiResponse } from 'next'

import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuth from '../../api/middlewares/withAuth'
import withPrisma from '../../api/middlewares/withPrisma'
import { RequestWithAuth } from '../../api/types'
import { USER_ROLE } from '../../common/constants'

const ERROR_PATH = 'pages/api/OneTimeTokensController()'

async function OneTimeTokensController(req: RequestWithAuth, res: NextApiResponse) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const oneTimeTokens = await req.db.oneTimeToken.findMany({
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
      data: oneTimeTokens,
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withPrisma(withAuth(OneTimeTokensController, [USER_ROLE.ADMINISTRATOR]))
