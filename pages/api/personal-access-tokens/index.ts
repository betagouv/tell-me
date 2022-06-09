import { ApiError } from '@api/libs/ApiError'
import { withAuth } from '@api/middlewares/withAuth'
import { withPrisma } from '@api/middlewares/withPrisma'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'
import crypto from 'crypto'
import dayjs from 'dayjs'

import type { RequestWithAuth } from '@api/types'
import type { NextApiHandler, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/personal-access-tokens/index.ts'

async function PersonalAccessTokenIndexEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const personalAccessTokens = await req.db.personalAccessToken.findMany({
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
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'POST':
      try {
        const label = String(req.body.label)
        const expiredAt = dayjs().add(90, 'day').toDate()
        const userId = req.me.id
        const value = crypto.randomBytes(32).toString('hex')

        const newPersonalAccessToken = await req.db.personalAccessToken.create({
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
        handleError(err, ERROR_PATH, res)
      }

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withAuth(PersonalAccessTokenIndexEndpoint as NextApiHandler, [UserRole.ADMINISTRATOR]))
