import { B } from 'bhala'
import { NextApiResponse } from 'next'

import { ApiError } from '../../api/libs/ApiError'

const getErrorConstructorName = (error: any) => {
  if (error === undefined || error.constructor === undefined) {
    return 'undefined'
  }

  return error.constructor.name
}

function handleError(error: any, path: string): void
function handleError(error: any, path: string, isFinal: false): void
function handleError(error: any, path: string, isFinal: true): never
function handleError(error: any, path: string, res: NextApiResponse): never
/**
 * Handle all kinds of errors. Any error should be caught and handled by this function.
 *
 * @example
 * handleError(err, "controllers/MyClass.myMethod()");
 * handleError(err, "helpers/myFunction()");
 * handleError(err, "scripts/myFileName#oneOfTheScriptFunctions()");
 */
function handleError(error: any, path: string, isFinalOrRes?: boolean | NextApiResponse): any {
  const { NODE_ENV } = process.env
  const IS_PRODUCTION = NODE_ENV === 'production'

  let errorString
  switch (true) {
    case typeof error === 'string':
      errorString = error
      break

    case error instanceof ApiError:
    case error instanceof Error:
      errorString = error.message
      break

    default:
      // eslint-disable-next-line no-case-declarations
      B.error(`[common/helpers/handleError()] This type of error cannot be processed. This should never happen.`)
      B.error(`[common/helpers/handleError()] Error Type: ${typeof error}`)
      B.error(`[common/helpers/handleError()] Error Constructor: ${getErrorConstructorName(error)}`)
      errorString = String(error)
  }

  // There is no need to cluster the log with handled errors
  if (!(error instanceof ApiError)) {
    B.error(`[${path}] ${errorString}`)
    // eslint-disable-next-line no-console
    console.error(error)
  }

  if (isFinalOrRes === undefined || isFinalOrRes === false) {
    return undefined as never
  }

  if (isFinalOrRes === true) {
    return process.exit(1)
  }

  // Unhandled errors are a serious security issue if exposed
  if (IS_PRODUCTION) {
    // But if `error.isExposed` is `true`, that means this is a handled error that can be useful to the client,
    // that's why we want to expose it but exclude the error path
    if (error.isExposed) {
      const code = error.status
      isFinalOrRes.status(code).json({
        code,
        hasError: true,
        message: errorString,
      })

      return undefined as never
    }

    // Otherwise, let's not reveal more than necessary
    const code = 400
    isFinalOrRes.status(code).json({
      code,
      hasError: true,
      message: 'Something went wrong.',
    })

    return undefined as never
  }

  // And in non-production environments, we can reveal (almost) everything
  const code = error.status || 500
  isFinalOrRes.status(code).json({
    code,
    hasError: true,
    message: errorString,
    path,
  })

  return undefined as never
}

export { handleError }
