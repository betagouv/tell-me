import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { UserRole } from '@prisma/client'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/one-time-tokens/[id].ts'

export default async function OneTimeTokenEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'DELETE':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR])

        const { id } = req.query
        if (typeof id !== 'string') {
          throw new ApiError('Not found.', 404, true)
        }

        await prisma.oneTimeToken.delete({
          where: {
            id,
          },
        })

        res.status(204).end()
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return undefined

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
