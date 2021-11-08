import User from '../models/User'
import handleError from './handleError.ts'

// Optimize subsequent requests once it's `true`
let IS_READY = false

// eslint-disable-next-line consistent-return
export default async function isReady() {
  try {
    if (!IS_READY) {
      const usersCount = await User.count().exec()

      IS_READY = usersCount > 0
    }

    return IS_READY
  } catch (err) {
    handleError(err, 'helpers/isReady()')
  }
}
