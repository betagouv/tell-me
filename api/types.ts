import { NextApiRequest, NextApiResponse } from 'next'

export type HandlerWithAuth<T = any> = (req: RequestWithAuth, res: NextApiResponse<T>) => void | Promise<void>

export type RequestMe = {
  id: string
}

export interface RequestWithAuth extends NextApiRequest {
  me: RequestMe
}
