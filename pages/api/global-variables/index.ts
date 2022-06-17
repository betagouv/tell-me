import { ApiError } from '@api/libs/ApiError'
import { withAuth } from '@api/middlewares/withAuth'
import { withPrisma } from '@api/middlewares/withPrisma'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'

import type { RequestWithAuth } from '@api/types'
import type { NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/global-variables.ts'

async function UserIndexEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const globalVariables = await req.db.globalVariable.findMany()

        res.status(200).json({
          data: globalVariables,
          hasError: false,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withAuth(UserIndexEndpoint as any, [UserRole.ADMINISTRATOR]))
