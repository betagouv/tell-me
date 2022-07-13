import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { UserRole } from '@prisma/client'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/me.ts'

export default async function UserConfigEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const me = await handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.VIEWER])

        const userConfig = await prisma.userConfig.findUnique({
          where: {
            userId: me.id,
          },
        })

        res.status(200).json({
          data: userConfig || {},
          hasError: false,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return

    case 'PATCH':
      try {
        const me = await handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.VIEWER])
        const updatedUserConfigData = {
          locale: String(req.body.locale),
        }

        const userConfig = await prisma.userConfig.findUnique({
          where: {
            userId: me.id,
          },
        })
        const updatedUserConfig =
          userConfig === null
            ? await prisma.userConfig.create({
                data: {
                  ...updatedUserConfigData,
                  userId: me.id,
                },
              })
            : await prisma.userConfig.update({
                data: updatedUserConfigData,
                where: {
                  userId: me.id,
                },
              })

        res.status(200).json({
          data: updatedUserConfig,
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
