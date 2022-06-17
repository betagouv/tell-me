import { ApiError } from '@api/libs/ApiError'
import { GlobalVariableKey, globalVariables } from '@api/libs/globalVariable'
import { withAuth } from '@api/middlewares/withAuth'
import { withPrisma } from '@api/middlewares/withPrisma'
import { RequestWithAuth } from '@api/types'
import { MIME_TYPES } from '@common/constants'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'
import cuid from 'cuid'
import { getAbsolutePath } from 'esm-path'
import formidable from 'formidable'

import type { NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/assets/index.ts'
const PUBLIC_ASSETS_ABSOLUTE_PATH = getAbsolutePath(import.meta.url, '../../../assets')

export const config = {
  api: {
    bodyParser: false,
  },
}

async function AssetIndexEndpoint(req: RequestWithAuth, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      try {
        const BASE_URL = await globalVariables.get(GlobalVariableKey.BASE_URL)

        const incomingForm = formidable({
          filename: (_, ext) => `${cuid()}${ext}`,
          filter: file => file.mimetype !== null && MIME_TYPES.includes(file.mimetype),
          keepExtensions: true,
          uploadDir: PUBLIC_ASSETS_ABSOLUTE_PATH,
        })

        await new Promise<void>((resolve, reject) => {
          incomingForm.parse(req, (err, fields, files) => {
            if (err) {
              reject(err)

              return
            }
            if (Array.isArray(files.file)) {
              reject(new ApiError("`files.file` shouldn't be an array.", 406))

              return
            }

            const { file } = files
            const assetPath = `/api/assets/${file.newFilename}`
            const assetUrl = BASE_URL !== null ? `${BASE_URL}${assetPath}` : null

            res.status(201).json({
              data: {
                path: assetPath,
                url: assetUrl,
              },
              hasError: false,
            })

            resolve()
          })
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return undefined

    default:
      handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }
}

export default withPrisma(withAuth(AssetIndexEndpoint as any, [UserRole.ADMINISTRATOR, UserRole.MANAGER]))
