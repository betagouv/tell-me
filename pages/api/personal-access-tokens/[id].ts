import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { UserRole } from '@prisma/client'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/personal-access-tokens/[id].ts'

export default async function PersonalAccessTokenEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR])

        const { id } = req.query
        if (typeof id !== 'string') {
          throw new ApiError('Not found.', 404, true)
        }

        const maybePersonalAccessToken = await prisma.personalAccessToken.findUnique({
          select: {
            createdAt: true,
            expiredAt: true,
            id: true,
            label: true,
            user: {
              select: {
                email: true,
                firstName: true,
                id: true,
                lastName: true,
              },
            },
          },
          where: {
            id,
          },
        })
        if (maybePersonalAccessToken === null) {
          throw new ApiError('Not found.', 404, true)
        }

        res.status(201).json({
          data: maybePersonalAccessToken,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return undefined

    case 'PATCH':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR])

        const { id } = req.query
        if (typeof id !== 'string') {
          throw new ApiError('Not found.', 404, true)
        }

        const maybePersonalAccessToken = await prisma.personalAccessToken.findUnique({
          where: {
            id,
          },
        })
        if (maybePersonalAccessToken === null) {
          throw new ApiError('Not found.', 404, true)
        }

        const label = String(req.body.label)

        const updatedPersonalAccessToken = await prisma.personalAccessToken.update({
          data: {
            label,
          },
          where: {
            id,
          },
        })

        res.status(201).json({
          data: updatedPersonalAccessToken,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return undefined

    case 'DELETE':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR])

        const { id } = req.query
        if (typeof id !== 'string') {
          throw new ApiError('Not found.', 404, true)
        }

        const maybePersonalAccessToken = await prisma.personalAccessToken.findUnique({
          where: {
            id,
          },
        })
        if (maybePersonalAccessToken === null) {
          throw new ApiError('Not found.', 404, true)
        }

        await prisma.personalAccessToken.delete({
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
