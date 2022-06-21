import { B } from 'bhala'

import { ApiError } from '../../api/libs/ApiError'
import { getConstructorName } from './getConstructorName'

function extractMessageFromAnyError(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof ApiError || error instanceof Error) {
    return error.message
  }

  B.error(`[common/helpers/handleError()] This type of error cannot be processed. This should never happen.`)
  B.error(`[common/helpers/handleError()] Error Type: ${typeof error}`)
  B.error(`[common/helpers/handleError()] Error Constructor: ${getConstructorName(error)}`)

  return String(error)
}

/**
 * Handle all kinds of errors. Any error should be caught and handled by this function.
 *
 * @example
 * handleError(err, "controllers/MyClass.myMethod()");
 * handleError(err, "helpers/myFunction()");
 * handleError(err, "scripts/myFileName#oneOfTheScriptFunctions()");
 */
export function handleError(
  error: unknown,
  path: string,
): {
  message: string
  path: string
} {
  const message = extractMessageFromAnyError(error)

  // There is no need to cluster logs with controlled errors
  if (!(error instanceof ApiError)) {
    B.error(`[${path}] ${message}`)
    // eslint-disable-next-line no-console
    console.error(error)
  }

  return {
    message,
    path,
  }
}
