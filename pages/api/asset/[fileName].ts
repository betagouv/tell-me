import ApiError from '@api/libs/ApiError'
import { handleError } from '@common/helpers/handleError'
import fs, { promises as fsAsync } from 'fs'
import { pathExists } from 'fs-extra'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

const ASSETS_PATH = path.join(process.cwd(), 'assets')
const ERROR_PATH = 'pages/api/asset/[fileName].ts'

async function AssetEndpoint(req: NextApiRequest, res: NextApiResponse) {
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
          res.status(404).end()

          return
        }

        const assetStat = await fsAsync.stat(assetPath)
        const responseHeaders = {
          'Content-Length': assetStat.size,
          'Content-Type': 'image/png',
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

export default AssetEndpoint
