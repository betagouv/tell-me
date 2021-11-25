import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export type HandlerWithAuth<T = any> = (req: RequestWithAuth, res: NextApiResponse<T>) => void | Promise<void>

export type HandlerWithPrisma<T = any> = (req: RequestWithPrisma, res: NextApiResponse<T>) => void | Promise<void>

export type RequestMe = {
  id: string
}

export interface RequestWithAuth extends RequestWithPrisma {
  me: RequestMe
}

export interface RequestWithPrisma extends NextApiRequest {
  db: PrismaClient
}
