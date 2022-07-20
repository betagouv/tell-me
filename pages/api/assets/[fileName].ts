import { getFileExtension } from '@api/helpers/getFileExtension'
import { isPath } from '@api/helpers/isPath'
import { ApiError } from '@api/libs/ApiError'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { FILE_EXTENSION_MIME_TYPE } from '@common/constants'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { UserRole } from '@prisma/client'
import { getAbsolutePath } from 'esm-path'
import fs, { promises as fsAsync } from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/asset/[fileName].ts'
const PRIVATE_ASSETS_RELATIVE_PATH = '../../../assets/private'
const PUBLIC_ASSETS_RELATIVE_PATH = '../../../assets'

export default async function AssetEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const { fileName } = req.query
        if (typeof fileName !== 'string') {
          throw new ApiError('Not found.', 404, true)
        }

        const publicAssetPath = getAbsolutePath(import.meta.url, PUBLIC_ASSETS_RELATIVE_PATH, fileName)
        const privateAssetPath = getAbsolutePath(import.meta.url, PRIVATE_ASSETS_RELATIVE_PATH, fileName)

        const isAssetPublic = await isPath(publicAssetPath)
        const isAssetPrivate = await isPath(privateAssetPath)
        if (!isAssetPublic && !isAssetPrivate) {
          throw new ApiError('Not found.', 404, true)
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
          throw new ApiError('Not acceptable.', 406, true)
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
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return undefined

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
