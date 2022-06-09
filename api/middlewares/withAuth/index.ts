import { UserRole } from '@prisma/client'

import { handleAuth } from './handleAuth'

import type { RequestWithPrisma } from '../../types'
import type { NextApiHandler, NextApiResponse } from 'next'

export function withAuth(
  handler: NextApiHandler,
  allowedRoles: UserRole[] = [UserRole.ADMINISTRATOR],
  isPublic = false,
) {
  const handlerWithAuth = async (req: RequestWithPrisma, res: NextApiResponse) => {
    const result = await handleAuth(req, res, allowedRoles, isPublic)
    if (result === undefined) {
      return
    }

    handler(result.reqWithAuth, result.res)
  }

  return handlerWithAuth
}

export { handleAuth }
