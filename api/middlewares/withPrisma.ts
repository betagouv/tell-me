import { PrismaClient } from '@prisma/client'
import { NextApiResponse } from 'next'

import handleError from '../helpers/handleError'
import { HandlerWithPrisma, RequestWithPrisma } from '../types'

function withPrismaSingleton() {
  let prismaInstance: Common.Nullable<PrismaClient> = null

  return function withPrisma(handler: HandlerWithPrisma) {
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
