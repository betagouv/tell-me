import { isReady } from '@api/helpers/isReady'
import { ApiError } from '@api/libs/ApiError'
import { handleError } from '@common/helpers/handleError'

import type { RequestWithAuth } from '@api/types'
import type { NextApiResponse } from 'next'

const { npm_package_version: VERSION } = process.env
const ERROR_PATH = 'pages/api/index.ts'

async function IndexEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const data: any = {
          version: VERSION,
        }
        data.isReady = await isReady()

        res.status(200).json({ data })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default IndexEndpoint
