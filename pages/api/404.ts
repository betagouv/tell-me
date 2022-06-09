import { ApiError } from '@api/libs/ApiError'
import { handleError } from '@common/helpers/handleError'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/404.ts'

export default async function NotFoundEndpoint(req: NextApiRequest, res: NextApiResponse) {
  handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
}
