/* eslint-disable consistent-return */

import fs, { promises as fsAsync } from 'fs'
import { pathExists } from 'fs-extra'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'

const ASSETS_PATH = path.join(process.cwd(), 'assets')
const ERROR_PATH = 'pages/api/asset/AssetController()'

async function AssetController(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  if (req.url === undefined) {
    handleError(new ApiError('Bad request.', 400, true), ERROR_PATH, res)

    return
  }

  const [assetFileName] = req.query.fileName
  const assetPath = path.join(ASSETS_PATH, assetFileName)
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
}

export default AssetController
