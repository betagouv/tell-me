import getJwtPayload from './getJwtPayload'
import handleError from './handleError'

/**
 * Validate a JWT and decode its payload
 *
 * @description
 * Return `null` if invalid.
 *
 * @param {string} token
 *
 * @returns {Promise<Object | null>}
 */
export default async function isJwtExpired(token) {
  try {
    const maybePayload = await getJwtPayload(token)

    if (maybePayload === null) {
      return true
    }

    return false
  } catch (err) {
    if (err?.code === 'ERR_JWT_EXPIRED') {
      return true
    }

    handleError(err, 'libs/isJwtExpired()')

    return true
  }
}
