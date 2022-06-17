import { ApiError } from '@api/libs/ApiError'
import { withAuth } from '@api/middlewares/withAuth'
import { withPrisma } from '@api/middlewares/withPrisma'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'

import type { RequestWithAuth } from '@api/types'
import type { NextApiHandler, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/one-time-tokens/[id].ts'

async function OneTimeTokenEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'DELETE':
      try {
        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        await req.db.oneTimeToken.delete({
          where: {
            id,
          },
        })

        res.status(204).end()
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return undefined

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withAuth(OneTimeTokenEndpoint as NextApiHandler, [UserRole.ADMINISTRATOR]))
