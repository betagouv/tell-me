import { promises as fs } from 'fs'
import { pathExists } from 'fs-extra'
import path from 'path'

import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'

const ASSETS_PATH = path.join(process.cwd(), 'assets')
const ERROR_PATH = 'pages/api/asset/AssetController()'

async function AssetController(req, res) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  const [assetFileName] = req.query.fileName
  const assetPath = path.join(ASSETS_PATH, assetFileName)
  if (!(await pathExists(assetPath))) {
    res.status(404).end()

    return
  }

  const assetSource = await fs.readFile(assetPath)

  res.status(200).send(assetSource)

  // eslint-disable-next-line consistent-return
  return undefined
}

export default AssetController
