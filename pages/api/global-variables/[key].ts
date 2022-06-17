import { ApiError } from '@api/libs/ApiError'
import { GlobalVariableKey } from '@api/libs/globalVariable'
import { withAuth } from '@api/middlewares/withAuth'
import { withPrisma } from '@api/middlewares/withPrisma'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'
import * as R from 'ramda'

import type { RequestWithAuth } from '@api/types'
import type { NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/users/[id].ts'

async function GlobalVariableEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'PATCH':
      try {
        const { key } = req.query
        if (typeof key !== 'string' || GlobalVariableKey[key] === undefined) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const updatedData = R.pick(['value'])(req.body) as {
          value: string | null
        }

        const globalVariableCount = await req.db.globalVariable.count({
          where: {
            key,
          },
        })
        if (globalVariableCount === 0) {
          const updatedGlobalVariable = await req.db.globalVariable.create({
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

        const updatedGlobalVariable = await req.db.globalVariable.update({
          data: updatedData,
          where: {
            key,
          },
        })

        res.status(200).json({
          data: updatedGlobalVariable,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return undefined

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withAuth(GlobalVariableEndpoint as any, [UserRole.ADMINISTRATOR]))
