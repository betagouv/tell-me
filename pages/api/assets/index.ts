import { ApiError } from '@api/libs/ApiError'
// import { globalVariables } from '@api/libs/globalVariable'
import { StaticServer } from '@api/libs/StaticServer'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { /* GlobalVariableKey, */ MIME_TYPES } from '@common/constants'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { UserRole } from '@prisma/client'
import cuid from 'cuid'
// import { getAbsolutePath } from 'esm-path'
import formidable from 'formidable'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/assets/index.ts'
// const PUBLIC_ASSETS_ABSOLUTE_PATH = getAbsolutePath(import.meta.url, '../../../assets')

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function AssetIndexEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER])

        // const BASE_URL = await globalVariables.get(GlobalVariableKey.BASE_URL)

        const incomingForm = formidable({
          filename: (_, ext) => `${cuid()}${ext}`,
          filter: file => file.mimetype !== null && MIME_TYPES.includes(file.mimetype as any),
          keepExtensions: true,
          // uploadDir: PUBLIC_ASSETS_ABSOLUTE_PATH,
        })

        await new Promise<void>((resolve, reject) => {
          incomingForm.parse(req, async (err, fields, files) => {
            if (err) {
              reject(err)

              return
            }
            if (Array.isArray(files.file)) {
              reject(new ApiError("`files.file` shouldn't be an array.", 406))

              return
            }

            try {
              const { file } = files

              const staticServer = new StaticServer()
              const uploadedFileInfo = await staticServer.upload(file.filepath, file.mimetype as any)

              // const assetPath = `/api/assets/${file.newFilename}`
              // const assetUrl = BASE_URL !== null ? `${BASE_URL}${assetPath}` : null

              res.status(201).json({
                data: {
                  url: uploadedFileInfo.publicUrl,
                },
                hasError: false,
              })

              resolve()
            } catch (errBis) {
              reject(errBis)
            }
          })
        })
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return undefined

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
