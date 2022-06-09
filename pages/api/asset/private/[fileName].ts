import { ApiError } from '@api/libs/ApiError'
import { withAuth } from '@api/middlewares/withAuth'
import { withPrisma } from '@api/middlewares/withPrisma'
import { RequestWithAuth } from '@api/types'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'
import fs, { promises as fsAsync } from 'fs'
import { pathExists } from 'fs-extra'
import { NextApiHandler, NextApiResponse } from 'next'
import path from 'path'

const ASSETS_PATH = path.join(process.cwd(), 'assets', 'private')
const ERROR_PATH = 'pages/api/asset/private/[fileName].ts'

async function PrivateAssetEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const { fileName } = req.query
        if (typeof fileName !== 'string') {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)

          return
        }

        const assetPath = path.join(ASSETS_PATH, fileName)
        if (!(await pathExists(assetPath))) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)

          return
        }

        const assetStat = await fsAsync.stat(assetPath)
        const responseHeaders = {
          'Content-Length': assetStat.size,
        }
        if (req.query.mimeType !== undefined) {
          responseHeaders['Content-Type'] = req.query.mimeType
        }

        res.writeHead(200, responseHeaders)

        const assetReadStream = fs.createReadStream(assetPath)
        assetReadStream.pipe(res)
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(
  withAuth(PrivateAssetEndpoint as NextApiHandler, [UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.VIEWER]),
)
