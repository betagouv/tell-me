import { getFileExtension } from '@api/helpers/getFileExtension'
import { isPath } from '@api/helpers/isPath'
import { ApiError } from '@api/libs/ApiError'
import { handleAuth } from '@api/middlewares/withAuth'
import { withPrisma } from '@api/middlewares/withPrisma'
import { FILE_EXTENSION_MIME_TYPE } from '@common/constants'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'
import { getAbsolutePath } from 'esm-path'
import fs, { promises as fsAsync } from 'fs'

import type { RequestWithPrisma } from '@api/types'
import type { NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/asset/[fileName].ts'
const PRIVATE_ASSETS_RELATIVE_PATH = '../../../assets/private'
const PUBLIC_ASSETS_RELATIVE_PATH = '../../../assets'

async function AssetEndpoint(req: RequestWithPrisma, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const { fileName } = req.query
        if (typeof fileName !== 'string') {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        const publicAssetPath = getAbsolutePath(import.meta.url, PUBLIC_ASSETS_RELATIVE_PATH, fileName)
        const privateAssetPath = getAbsolutePath(import.meta.url, PRIVATE_ASSETS_RELATIVE_PATH, fileName)

        const isAssetPublic = await isPath(publicAssetPath)
        const isAssetPrivate = await isPath(privateAssetPath)
        if (!isAssetPublic && !isAssetPrivate) {
          return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }
        if (!isAssetPublic) {
          await handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.VIEWER])

          if (res.writableFinished) {
            return undefined
          }
        }

        const assetPath = isAssetPublic ? publicAssetPath : privateAssetPath
        const assetFileExtension = getFileExtension(assetPath)
        const assetMimeType = FILE_EXTENSION_MIME_TYPE[assetFileExtension]
        if (assetMimeType === undefined) {
          return handleError(new ApiError('Not acceptable.', 406, true), ERROR_PATH, res)
        }

        const assetStat = await fsAsync.stat(assetPath)

        const responseHeaders = {
          'Content-Length': assetStat.size,
          'Content-Type': assetMimeType,
        }

        res.writeHead(200, responseHeaders)

        const assetReadStream = fs.createReadStream(assetPath)
        assetReadStream.pipe(res)
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return undefined

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(AssetEndpoint)
