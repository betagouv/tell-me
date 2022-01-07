import bcrypt from 'bcryptjs'
import dayjs from 'dayjs'
import { NextApiResponse } from 'next'
import R from 'ramda'

import getJwt from '../../../api/helpers/getJwt'
import handleError from '../../../api/helpers/handleError'
import ApiError from '../../../api/libs/ApiError'
import withPrisma from '../../../api/middlewares/withPrisma'
import { RequestWithPrisma } from '../../../api/types'

const { NODE_ENV } = process.env
const ERROR_PATH = 'pages/api/auth/AuthLoginController()'

async function AuthLoginController(req: RequestWithPrisma, res: NextApiResponse) {
  if (req.method !== 'POST') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const loginUserData = {
      email: String(req.body.email),
      password: String(req.body.password),
    }

    const maybeUser = await req.db.user.findUnique({
      where: {
        email: loginUserData.email,
      },
    })
    if (maybeUser === null) {
      handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)

      return
    }

    const matchPassword = await bcrypt.compare(loginUserData.password, maybeUser.password)
    if (!matchPassword) {
      handleError(new ApiError('Unauthorized.', 401, true), ERROR_PATH, res)

      return
    }
    if (!maybeUser.isActive) {
      handleError(new ApiError('Forbidden.', 403, true), ERROR_PATH, res)

      return
    }

    const maybeIp = NODE_ENV === 'production' ? req.headers['x-real-ip'] : '0.0.0.0'
    if (maybeIp === undefined) {
      handleError(new ApiError(`Unresolvable IP.`, 403, true), ERROR_PATH, res)

      return
    }

    const ip = Array.isArray(maybeIp) ? maybeIp.join(', ') : maybeIp
    const userId = maybeUser.id

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

    // Delete all existing Refresh JWT for the authenticated user client
    await req.db.refreshToken.deleteMany({
      where: {
        ip,
        userId,
      },
    })

    const expiredAt = dayjs().add(7, 'day').toDate()
    const refreshTokenValue = await getJwt(tokenPayload, ip)
    if (refreshTokenValue === null) {
      handleError(new ApiError(`JWT generation failed.`, 500), ERROR_PATH, res)

      return
    }

    // Save the new Refresh JWT for the authenticated user client
    await req.db.refreshToken.create({
      data: {
        expiredAt,
        ip,
        userId,
        value: refreshTokenValue,
      },
    })

    res.status(200).json({
      data: {
        refreshToken: refreshTokenValue,
        sessionToken: sessionTokenValue,
      },
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withPrisma(AuthLoginController)
