import { NextApiResponse } from 'next'
import R from 'ramda'

import encrypt from '../../../api/helpers/encrypt'
import handleError from '../../../api/helpers/handleError'
import isReady from '../../../api/helpers/isReady'
import ApiError from '../../../api/libs/ApiError'
import withPrisma from '../../../api/middlewares/withPrisma'
import { RequestWithPrisma } from '../../../api/types'
import { USER_ROLE } from '../../../common/constants'

const ERROR_PATH = 'pages/api/auth/AuthSignupController()'

async function AuthSignupController(req: RequestWithPrisma, res: NextApiResponse) {
  if (req.method !== 'POST') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const newUserData = {
      email: String(req.body.email),
    }
    const password = await encrypt(String(req.body.password))

    if (!(await isReady())) {
      // We make the new user an active one if it's the first one
      // because that means this user is following the first setup steps
      ;(newUserData as any).isActive = true

      // And we give them an administrator role
      ;(newUserData as any).role = USER_ROLE.ADMINISTRATOR as Common.User.Role
    }

    const newUser = await req.db.user.create({
      data: {
        ...newUserData,
        password,
      },
    })
    await req.db.userConfig.create({
      data: {
        userId: newUser.id,
      },
    })

    const newUserWithoutPassword = R.omit(['password'])(newUser)

    res.status(201).json(newUserWithoutPassword)
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withPrisma(AuthSignupController)
