import { handleError } from '@common/helpers/handleError'
import { PrismaClient } from '@prisma/client'

import type { RequestWithPrisma } from '../types'
import type { NextApiResponse } from 'next'

function withPrismaSingleton() {
  let prismaInstance: Common.Nullable<PrismaClient> = null

  return function withPrisma(handler: any) {
    const handlerWithPrisma = async (req: RequestWithPrisma, res: NextApiResponse) => {
      try {
        if (prismaInstance === null) {
          prismaInstance = new PrismaClient()
        }

        const reqWithPrisma: RequestWithPrisma = Object.assign(req, {
          db: prismaInstance,
        })

        await handler(reqWithPrisma, res)
      } catch (err) {
        handleError(err, 'api/middlewares/withPrisma()', res)
      } finally {
        if (prismaInstance !== null) {
          await prismaInstance.$disconnect()
        }
      }
    }

    return handlerWithPrisma
  }
}

export default withPrismaSingleton()
