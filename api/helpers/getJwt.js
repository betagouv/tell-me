// TODO Generating refresh token based on the IP doesn't seem to be the most reliable way to achieve this.

import jsonwebtoken from 'jsonwebtoken'
import { promisify } from 'util'

import handleError from './handleError'

const { RSA_PRIVATE_KEY } = process.env
const TWENTY_MINUTES_IN_SECONDS = 20 * 60
const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60

const signJwt = promisify(jsonwebtoken.sign)

/**
 * Generate either a Session or a Refresh JWT if an `ip` is provided
 *
 * @param {Object}    payload   A POJO containing public user data
 * @param {string=}   ip        User client IP
 *
 * @returns {Promise<string>}
 */
export default async function getJwt(payload, ip = null) {
  try {
    const isRefresh = ip !== null

    // PS256 = signed with RSASSA-PSS algo and hashed via SHA-256
    // https://www.scottbrady91.com/JOSE/JWTs-Which-Signing-Algorithm-Should-I-Use
    const signatureOptions = {
      algorithm: 'PS256',
      expiresIn: isRefresh ? SEVEN_DAYS_IN_SECONDS : TWENTY_MINUTES_IN_SECONDS,
    }

    const token = await signJwt(payload, RSA_PRIVATE_KEY, signatureOptions)

    return token
  } catch (err) {
    handleError(err, 'helpers/getJwt()')

    return null
  }
}
