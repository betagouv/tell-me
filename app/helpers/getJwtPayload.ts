// eslint-disable-next-line import/no-unresolved
import { parseJwk } from 'jose-browser-runtime/jwk/parse'
// eslint-disable-next-line import/no-unresolved
import { jwtVerify } from 'jose-browser-runtime/jwt/verify'
import { pem2jwk } from 'pem-jwk'

import handleError from './handleError'

/**
 * Validate a JWT and decode its payload
 *
 * @description
 * Return `null` if invalid.
 */
export default async function getJwtPayload(token: string): Promise<Common.Nullable<Common.Authentication.Payload>> {
  try {
    // Convert RSA Public Key format from PEM to JWK
    const rsaPublicKeyJwk = pem2jwk(process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY)
    // Convert RSA Public Key format from JWK to internal KeyLike Jose format:
    const rsaPublicKeyLike = await parseJwk(rsaPublicKeyJwk, 'PS256')
    const { payload } = (await jwtVerify(token, rsaPublicKeyLike, {})) as any

    return payload

    // https://github.com/panva/jose/blob/main/test/jwt/verify.test.mjs
  } catch (err) {
    // Re-throw expiration errors for `isJwtExpired()` helper
    if (err?.code === 'ERR_JWT_EXPIRED') {
      throw err
    }

    // Ignore IAT errors to skip client device time synchronization issues
    if (
      err?.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED' &&
      err.message === `"iat" claim timestamp check failed (it should be in the past)`
    ) {
      return null
    }

    // Handle unexpected errors
    // `ERR_JWS_SIGNATURE_VERIFICATION_FAILED` mean it's an invalid JWT
    if (err?.code !== 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
      handleError(err, 'libs/getJwtPayload()')
    }

    return null
  }
}
