import { ApiError } from '@api/libs/ApiError'
import { withAuth } from '@api/middlewares/withAuth'
import { withPrisma } from '@api/middlewares/withPrisma'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'

import type { RequestWithAuth } from '@api/types'
import type { NextApiHandler, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/personal-access-tokens/[id].ts'

async function PersonalAccessTokenEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybePersonalAccessToken = await req.db.personalAccessToken.findUnique({
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
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        res.status(201).json({
          data: maybePersonalAccessToken,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return undefined as never

    case 'PATCH':
      try {
        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybePersonalAccessToken = await req.db.personalAccessToken.findUnique({
          where: {
            id,
          },
        })
        if (maybePersonalAccessToken === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const label = String(req.body.label)

        const updatedPersonalAccessToken = await req.db.personalAccessToken.update({
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
        handleError(err, ERROR_PATH, res)
      }

      return undefined as never

    case 'DELETE':
      try {
        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybePersonalAccessToken = await req.db.personalAccessToken.findUnique({
          where: {
            id,
          },
        })
        if (maybePersonalAccessToken === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        await req.db.personalAccessToken.delete({
          where: {
            id,
          },
        })

        res.status(204).end()
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return undefined as never

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withAuth(PersonalAccessTokenEndpoint as NextApiHandler, [UserRole.ADMINISTRATOR]))
