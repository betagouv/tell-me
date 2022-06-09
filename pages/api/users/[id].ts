import ApiError from '@api/libs/ApiError'
import withAuth from '@api/middlewares/withAuth'
import withPrisma from '@api/middlewares/withPrisma'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'
import * as R from 'ramda'

import type { RequestWithAuth } from '@api/types'
import type { NextApiHandler, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/users/[id].ts'

async function UserEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeUser = await req.db.user.findUnique({
          where: {
            id,
          },
        })
        if (maybeUser === null) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const userWithoutPassword = R.omit(['password'])(maybeUser)

        res.status(200).json({
          data: userWithoutPassword,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'PATCH':
      try {
        const { id } = req.query
        if (typeof id !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const maybeUser = await req.db.user.findUnique({
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
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const updatedUserData = R.pick(['email', 'firstName', 'isActive', 'lastName', 'role'])(req.body) as {
          email: string
          firstName: string
          isActive: boolean
          lastName: string
          role: UserRole
        }

        const updatedUser = await req.db.user.update({
          data: updatedUserData,
          where: {
            id,
          },
        })

        const updatedUserWithoutPassword = R.omit(['password'])(updatedUser)

        res.status(200).json({
          data: updatedUserWithoutPassword,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withAuth(UserEndpoint as NextApiHandler, [UserRole.ADMINISTRATOR]))
