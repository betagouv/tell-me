import { promises as fs } from 'fs'
import { pathExists } from 'fs-extra'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withAuth from '../../../api/middlewares/withAuth'
import withPrisma from '../../../api/middlewares/withPrisma'
import { USER_ROLE } from '../../../common/constants'

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

  const maybeAuthMiddleware = req.url.startsWith('/api/asset/private/')
    ? (handler: NextApiHandler) =>
        withPrisma(withAuth(handler, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER, USER_ROLE.VIEWER]))
    : (handler: NextApiHandler) => handler(req, res)

  // eslint-disable-next-line consistent-return
  return maybeAuthMiddleware(async (req, res) => {
    const [assetFileName] = req.query.fileName
    const assetPath = path.join(ASSETS_PATH, assetFileName)
    if (!(await pathExists(assetPath))) {
      res.status(404).end()

      return
    }

    const assetSource = await fs.readFile(assetPath)

    res.status(200).send(assetSource)
  })
}

export default AssetController
