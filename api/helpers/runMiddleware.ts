import { handleError } from '@common/helpers/handleError'

import type { NextApiRequest, NextApiResponse } from 'next'

export type Middleware = (req: NextApiRequest, res: NextApiResponse, next: (err?: any) => void) => void

export async function runMiddleware(req: NextApiRequest, res: NextApiResponse, middleware: Middleware) {
  return new Promise<void>(resolve => {
    middleware(req, res, err => {
      if (err !== undefined) {
        return handleError(err, '', res)
      }

      return resolve()
    })
  })
}
