import User from '../models/User'
import handleError from './handleError'

// Optimize subsequent requests once it's `true`
let IS_READY = false

export default async function isReady(): Promise<boolean> {
  try {
    if (!IS_READY) {
      const usersCount = await User.count().exec()

      IS_READY = usersCount > 0
    }

    return IS_READY
  } catch (err) {
    handleError(err, 'helpers/isReady()')

    return false
  }
}
