import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { UserRole } from '@prisma/client'
import crypto from 'crypto'
import dayjs from 'dayjs'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/personal-access-tokens/index.ts'

export default async function PersonalAccessTokenIndexEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR])

        const personalAccessTokens = await prisma.personalAccessToken.findMany({
          select: {
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
        })

        res.status(200).json({
          data: personalAccessTokens,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return

    case 'POST':
      try {
        const me = await handleAuth(req, res, [UserRole.ADMINISTRATOR])

        const label = String(req.body.label)
        const expiredAt = dayjs().add(90, 'day').toDate()
        const userId = me.id
        const value = crypto.randomBytes(32).toString('hex')

        const newPersonalAccessToken = await prisma.personalAccessToken.create({
          data: {
            expiredAt,
            label,
            userId,
            value,
          },
          select: {
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
            value: true,
          },
        })

        res.status(201).json({
          data: newPersonalAccessToken,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
