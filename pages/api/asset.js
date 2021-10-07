import { promises as fs } from 'fs'
import path from 'path'

import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'

const ASSETS_PATH = path.join(process.cwd(), 'assets')
const ERROR_PATH = 'pages/api/auth/IndexController()'

async function AssetController(req, res) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  const [assetFileName] = req.query.fileName
  const assetPath = path.join(ASSETS_PATH, assetFileName)

  const assetSource = await fs.readFile(assetPath)

  res.status(200).send(assetSource)

  // eslint-disable-next-line consistent-return
  return undefined
}

export default AssetController
