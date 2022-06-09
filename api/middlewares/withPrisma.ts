import { handleError } from '@common/helpers/handleError'

import { prisma } from '../libs/prisma'

import type { RequestWithPrisma } from '../types'
import type { NextApiResponse } from 'next'

export function withPrisma(handler: any) {
  const handlerWithPrisma = async (req: RequestWithPrisma, res: NextApiResponse) => {
    try {
      const reqWithPrisma: RequestWithPrisma = Object.assign(req, {
        db: prisma,
      })

      await handler(reqWithPrisma, res)
    } catch (err) {
      handleError(err, 'api/middlewares/withPrisma()', res)
    }
  }

  return handlerWithPrisma
}
