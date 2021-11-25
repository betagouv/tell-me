import { NextApiResponse } from 'next'

import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuth from '../../api/middlewares/withAuth'
import withPrisma from '../../api/middlewares/withPrisma'
import { RequestWithAuth } from '../../api/types'
import { USER_ROLE } from '../../common/constants'

const ERROR_PATH = 'pages/api/RefreshTokenController()'

async function RefreshTokenController(req: RequestWithAuth, res: NextApiResponse) {
  if (req.method === undefined || !['DELETE'].includes(req.method)) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'DELETE':
      try {
        const {
          refreshTokenId: [refreshTokenId],
        } = req.query

        await req.db.refreshToken.delete({
          where: {
            id: refreshTokenId,
          },
        })

        res.status(204).end()
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }
  }
}

export default withPrisma(withAuth(RefreshTokenController, [USER_ROLE.ADMINISTRATOR]))
