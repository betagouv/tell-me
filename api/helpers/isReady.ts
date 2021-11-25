import { PrismaClient } from '@prisma/client'

import handleError from './handleError'

// Optimize subsequent requests once it's `true`
let IS_READY = false

export default async function isReady(): Promise<boolean> {
  try {
    if (!IS_READY) {
      const prismaInstance = new PrismaClient()
      const usersCount = await prismaInstance.user.count()
      await prismaInstance.$disconnect()

      IS_READY = usersCount > 0
    }

    return IS_READY
  } catch (err) {
    handleError(err, 'api/helpers/isReady()')

    return false
  }
}
