/* eslint-disable consistent-return */

import fs, { promises as fsAsync } from 'fs'
import { pathExists } from 'fs-extra'
import { NextApiResponse } from 'next'
import path from 'path'

import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuth from '../../../api/middlewares/withAuth'
import withPrisma from '../../../api/middlewares/withPrisma'
import { RequestWithAuth } from '../../../api/types'
import { USER_ROLE } from '../../../common/constants'

const ASSETS_PATH = path.join(process.cwd(), 'assets', 'private')
const ERROR_PATH = 'pages/api/asset/AssetController()'

async function AssetController(req: RequestWithAuth, res: NextApiResponse) {
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
}

export default withPrisma(withAuth(AssetController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER, USER_ROLE.VIEWER]))
