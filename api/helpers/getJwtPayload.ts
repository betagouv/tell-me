import jsonwebtoken from 'jsonwebtoken'
import { promisify } from 'util'

import handleError from './handleError'

const { RSA_PRIVATE_KEY } = process.env

const verifyJwt = promisify(jsonwebtoken.verify)

/**
 * Validate a JWT and decode its payload
 *
 * @description
 * Return `null` if invalid.
 */
export default async function getJwtPayload(token: string): Promise<
  Common.Nullable<{
    _id: string
  }>
> {
  try {
    const verificationOptions = {
      algorithms: ['PS256'],
    }

    const body = await verifyJwt(token, RSA_PRIVATE_KEY, verificationOptions)

    return body
  } catch (err) {
    // Handle unexpected errors
    if (err?.name !== 'JsonWebTokenError') {
      handleError(err, 'helpers/getJwtPayload()')
    }

    return null
  }
}
