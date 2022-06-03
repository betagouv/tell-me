import type { PrismaClient } from '@prisma/client'
import type { NextApiRequest } from 'next'

export type RequestMe = {
  id: string
}

export interface RequestWithAuth extends RequestWithPrisma {
  me: RequestMe
}

export interface RequestWithPrisma extends NextApiRequest {
  db: PrismaClient
}
