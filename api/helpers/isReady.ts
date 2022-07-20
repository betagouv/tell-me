import { handleError } from '@common/helpers/handleError'

import { prisma } from '../libs/prisma'

// Optimize subsequent requests once it's `true`
let IS_READY = false

export async function isReady(): Promise<boolean> {
  try {
    if (!IS_READY) {
      const usersCount = await prisma.user.count()
      await prisma.$disconnect()

      IS_READY = usersCount > 0
    }

    return IS_READY
  } catch (err) {
    handleError(err, 'api/helpers/isReady()')

    return false
  }
}
