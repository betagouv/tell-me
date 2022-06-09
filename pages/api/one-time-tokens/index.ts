import { ApiError } from '@api/libs/ApiError'
import { withAuth } from '@api/middlewares/withAuth'
import { withPrisma } from '@api/middlewares/withPrisma'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'

import type { RequestWithAuth } from '@api/types'
import type { NextApiHandler, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/one-time-tokens/index.ts'

async function OneTimeTokenIndexEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
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

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withAuth(OneTimeTokenIndexEndpoint as NextApiHandler, [UserRole.ADMINISTRATOR]))
