import { ApiError } from '@api/libs/ApiError'

import { handleError } from './handleError'

/**
 * Handle internal API errors.
 *
 * @description
 * When an error happens within internal API functions,
 * we don't have access to the response in order to properly send a 4XX.
 * This error handler rethrow a generic ApiError to bubble up the error
 * until the original API Endpoint function is reached,
 * so that it can respond with a 4XX.
 *
 * ⚠️ Don't use that within SSR pages!
 */
export function handleApiError(error: any, path: string): never {
  if (!(error instanceof ApiError)) {
    handleError(error, path)
  }

  throw new ApiError('Something went wrong. Please check your server logs.', 400)
}
