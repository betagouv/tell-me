import { ApiError } from '@api/libs/ApiError'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/404.ts'

export default async function NotFoundEndpoint(req: NextApiRequest, res: NextApiResponse) {
  handleApiEndpointError(new ApiError('Not found.', 404, true), ERROR_PATH, res, true)
}
