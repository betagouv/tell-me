import * as R from 'ramda'

import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuth from '../../api/middlewares/withAuth'
import withPrisma from '../../api/middlewares/withPrisma'
import { USER_ROLE } from '../../common/constants'

import type { RequestWithAuth } from '../../api/types'
import type { NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/UserController()'

async function UserController(req: RequestWithAuth, res: NextApiResponse) {
  if (req.method === undefined || !['GET', 'PATCH'].includes(String(req.method))) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'GET':
      try {
        const {
          userId: [userId],
        } = req.query

        const maybeUser = await req.db.user.findUnique({
          where: {
            id: userId,
          },
        })
        if (maybeUser === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
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
        const {
          userId: [userId],
        } = req.query

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
            id: userId,
          },
        })
        if (maybeUser === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const updatedUserData = R.pick(['email', 'firstName', 'isActive', 'lastName', 'role'])(req.body) as {
          email: string
          firstName: string
          isActive: boolean
          lastName: string
          role: Common.User.Role
        }

        const updatedUser = await req.db.user.update({
          data: updatedUserData,
          where: {
            id: userId,
          },
        })

        const updatedUserWithoutPassword = R.omit(['password'])(updatedUser)

        res.status(200).json({
          data: updatedUserWithoutPassword,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }
  }
}

export default withPrisma(withAuth(UserController, [USER_ROLE.ADMINISTRATOR]))
