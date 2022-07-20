import { isReady } from '@api/helpers/isReady'
import { ApiError } from '@api/libs/ApiError'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'

import type { NextApiRequest, NextApiResponse } from 'next'

const { npm_package_version: VERSION } = process.env
const ERROR_PATH = 'pages/api/index.ts'

export default async function IndexEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const data: any = {
          version: VERSION,
        }
        data.isReady = await isReady()

        res.status(200).json({
          data,
          hasError: false,
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
