import type { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export type RequestMe = {
  id: string
}

export interface RequestWithAuth extends RequestWithPrisma {
  me: RequestMe
}

export interface RequestWithPrisma extends NextApiRequest {
  db: PrismaClient
}

export type NextApiHandlerWithPrisma<T = any> = (
  req: RequestWithPrisma,
  res: NextApiResponse<T>,
) => unknown | Promise<unknown>
