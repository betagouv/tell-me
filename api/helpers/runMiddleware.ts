import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { handleApiError } from '@common/helpers/handleApiError'

import type { NextApiRequest, NextApiResponse } from 'next'

export type Middleware = (req: NextApiRequest, res: NextApiResponse, next: (err?: any) => void) => void

export async function runMiddleware(req: NextApiRequest, res: NextApiResponse, middleware: Middleware): Promise<void> {
  try {
    return await new Promise<void>(resolve => {
      middleware(req, res, err => {
        if (err !== undefined) {
          handleApiEndpointError(err, '', res)
        }

        return resolve()
      })
    })
  } catch (err) {
    return handleApiError(err, 'api/helpers/runMiddleware()')
  }
}
