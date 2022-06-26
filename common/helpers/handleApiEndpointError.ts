import { ApiError } from '@api/libs/ApiError'
import { SilentError } from '@common/libs/SilentError'

import { handleError } from './handleError'

import type { NextApiResponse } from 'next'

/**
 * Handle internal API Endpoint errors and return an 4XX or 5XX response.
 *
 * @description
 * If <isLast> is not set to `true`, the handler will rethrow a SilentError
 * after sending the response to avoid any subsequent code to be run.
 */
export function handleApiEndpointError(
  error: unknown,
  path: string,
  res: NextApiResponse,
  isLast: boolean = false,
): never {
  if (isLast && error instanceof SilentError) {
    return undefined as never
  }

  const { message } = handleError(error, path)
  const isProduction = process.env.NODE_ENV === 'production'

  // Unhandled errors are a serious security issue if exposed
  if (isProduction) {
    // If `error.isExposed` is `true`, this handled error can be useful to the client,
    // so let's expose its message but not its path
    if (error instanceof ApiError && error.isExposed) {
      const code = error.status
      res.status(code).json({
        code,
        hasError: true,
        message,
      })

      throw new SilentError()
    }

    // Otherwise, let's keep it generic
    const code = 400
    res.status(code).json({
      code,
      hasError: true,
      message: 'Something went wrong. Please check your server logs.',
    })

    throw new SilentError()
  }

  // And in non-production environments, we can reveal (almost) everything
  const code = error instanceof ApiError ? error.status : 400
  res.status(code).json({
    code,
    hasError: true,
    message,
    path,
  })

  if (!isLast) {
    throw new SilentError()
  }

  return undefined as never
}
