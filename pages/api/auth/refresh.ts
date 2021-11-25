import { NextApiResponse } from 'next'
import R from 'ramda'

import getJwt from '../../../api/helpers/getJwt'
import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withPrisma from '../../../api/middlewares/withPrisma'
import { RequestWithPrisma } from '../../../api/types'

const ERROR_PATH = 'pages/api/auth/AuthRefreshController()'

async function AuthRefreshController(req: RequestWithPrisma, res: NextApiResponse) {
  if (req.method !== 'POST') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const refreshTokenValue = String(req.body.refreshToken)

    const maybeRefreshToken = await req.db.refreshToken.findUnique({
      include: {
        user: true,
      },
      where: {
        value: refreshTokenValue,
      },
    })
    if (maybeRefreshToken === null) {
      handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)

      return
    }

    const userId = maybeRefreshToken.user.id
    const maybeUser = await req.db.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (maybeUser === null) {
      handleError(new ApiError(`Unauthorized.`, 401, true), ERROR_PATH, res)

      return
    }
    if (!maybeUser.isActive) {
      handleError(new ApiError('Forbidden.', 403, true), ERROR_PATH, res)

      return
    }

    const userConfig = await req.db.userConfig.findUnique({
      where: {
        userId,
      },
    })
    const tokenPayload = {
      ...R.pick(['email', 'firstName', 'id', 'lastName', 'role'], maybeUser),
      ...R.pick(['locale'], userConfig),
    } as {
      email: string
      firstName: string
      id: string
      lastName: string
      role: string
    }
    const sessionTokenValue = await getJwt(tokenPayload)
    if (sessionTokenValue === null) {
      handleError(new ApiError(`JWT generation failed.`, 500), ERROR_PATH, res)

      return
    }

    res.status(200).json({
      data: {
        sessionToken: sessionTokenValue,
      },
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withPrisma(AuthRefreshController)
