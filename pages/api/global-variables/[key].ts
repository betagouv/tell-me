import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { GlobalVariableKey } from '@common/constants'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { UserRole } from '@prisma/client'
import * as R from 'ramda'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/users/[id].ts'

export default async function GlobalVariableEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PATCH':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR])

        const { key } = req.query
        if (typeof key !== 'string' || GlobalVariableKey[key] === undefined) {
          throw new ApiError('Not found.', 404, true)
        }

        const updatedData = R.pick(['value'])(req.body) as {
          value: string | null
        }

        const globalVariableCount = await prisma.globalVariable.count({
          where: {
            key,
          },
        })
        if (globalVariableCount === 0) {
          const updatedGlobalVariable = await prisma.globalVariable.create({
            data: {
              ...updatedData,
              key,
            },
          })

          res.status(201).json({
            data: updatedGlobalVariable,
          })

          return undefined
        }

        const updatedGlobalVariable = await prisma.globalVariable.update({
          data: updatedData,
          where: {
            key,
          },
        })

        res.status(200).json({
          data: updatedGlobalVariable,
          hasError: false,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return undefined

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
