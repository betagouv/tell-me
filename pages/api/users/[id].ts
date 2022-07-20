import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { UserRole } from '@prisma/client'
import * as R from 'ramda'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/users/[id].ts'

export default async function UserEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR])

        const { id } = req.query
        if (typeof id !== 'string') {
          throw new ApiError('Not found.', 404, true)
        }

        const maybeUser = await prisma.user.findUnique({
          where: {
            id,
          },
        })
        if (maybeUser === null) {
          throw new ApiError('Not found.', 404, true)
        }

        const userWithoutPassword = R.omit(['password'])(maybeUser)

        res.status(200).json({
          data: userWithoutPassword,
          hasError: false,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return

    case 'PATCH':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR])

        const { id } = req.query
        if (typeof id !== 'string') {
          throw new ApiError('Not found.', 404, true)
        }

        const maybeUser = await prisma.user.findUnique({
          select: {
            email: true,
            firstName: true,
            id: true,
            isActive: true,
            lastName: true,
            role: true,
          },
          where: {
            id,
          },
        })
        if (maybeUser === null) {
          throw new ApiError('Not found.', 404, true)
        }

        const updatedUserData = R.pick(['email', 'firstName', 'isActive', 'lastName', 'role'])(req.body) as {
          email: string
          firstName: string
          isActive: boolean
          lastName: string
          role: UserRole
        }

        const updatedUser = await prisma.user.update({
          data: updatedUserData,
          where: {
            id,
          },
        })

        const updatedUserWithoutPassword = R.omit(['password'])(updatedUser)

        res.status(200).json({
          data: updatedUserWithoutPassword,
          hasError: false,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
