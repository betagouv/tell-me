import ApiError from '@api/libs/ApiError'
import withAuth from '@api/middlewares/withAuth'
import withPrisma from '@api/middlewares/withPrisma'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'

import type { RequestWithAuth } from '@api/types'
import type { NextApiHandler, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/me.ts'

async function UserConfigEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const userId = req.me.id

        const userConfig = await req.db.userConfig.findUnique({
          where: {
            userId,
          },
        })

        res.status(200).json({
          data: userConfig,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'PATCH':
      try {
        const userId = req.me.id
        const updatedUserConfigData = {
          locale: String(req.body.locale),
        }

        const updatedUserConfig = await req.db.userConfig.update({
          data: updatedUserConfigData,
          where: {
            userId,
          },
        })

        res.status(200).json({
          data: updatedUserConfig,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(
  withAuth(UserConfigEndpoint as NextApiHandler, [UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.VIEWER]),
)
