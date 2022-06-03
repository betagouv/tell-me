import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuth from '../../api/middlewares/withAuth'
import withPrisma from '../../api/middlewares/withPrisma'
import { USER_ROLE } from '../../common/constants'

import type { RequestWithAuth } from '../../api/types'
import type { NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/UserConfigController()'

async function UserConfigController(req: RequestWithAuth, res: NextApiResponse) {
  if (req.method === undefined || !['GET', 'PATCH'].includes(String(req.method))) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'GET':
      try {
        const userId = req.me.id

        const userConfig = await req.db.userConfig.findUnique({
          where: {
            userId,
          },
        })

        res.status(200).json({
          data: userConfig,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'PATCH':
      try {
        const userId = req.me.id
        const updatedUserConfigData = {
          locale: String(req.body.locale),
        }

        const updatedUserConfig = await req.db.userConfig.update({
          data: updatedUserConfigData,
          where: {
            userId,
          },
        })

        res.status(200).json({
          data: updatedUserConfig,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }
  }
}

export default withPrisma(
  withAuth(UserConfigController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER, USER_ROLE.VIEWER]),
)
