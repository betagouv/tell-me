import bcrypt from 'bcryptjs'
import R from 'ramda'

import handleError from '../../../api/helpers/handleError.ts'
import isReady from '../../../api/helpers/isReady'
import ApiError from '../../../api/libs/ApiError'
import withMongoose from '../../../api/middlewares/withMongoose'
import User from '../../../api/models/User'
import UserConfig from '../../../api/models/UserConfig'
import { USER_ROLE } from '../../../common/constants'

const ERROR_PATH = 'pages/api/auth/AuthSignupController()'
const BCRYPT_SALT_WORK_FACTOR = 10

async function AuthSignupController(req, res) {
  if (req.method !== 'POST') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const newUserData = R.pick(['email'], req.body)
    newUserData.password = await bcrypt.hash(req.body.password, BCRYPT_SALT_WORK_FACTOR)

    if (!(await isReady())) {
      // We make the new user an active one if it's the first one
      // because that means this user is following the first setup steps
      newUserData.isActive = true

      // And we give them an administrator role
      newUserData.role = USER_ROLE.ADMINISTRATOR
    }

    const newUser = new User(newUserData)
    await newUser.save()

    const newUserConfig = new UserConfig({
      user: newUser.id,
    })
    await newUserConfig.save()

    res.status(201).json({})
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withMongoose(AuthSignupController)
