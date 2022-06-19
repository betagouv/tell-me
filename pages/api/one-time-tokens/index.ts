import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { UserRole } from '@prisma/client'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/one-time-tokens/index.ts'

export default async function OneTimeTokenIndexEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR])

        const oneTimeTokens = await prisma.oneTimeToken.findMany({
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
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
