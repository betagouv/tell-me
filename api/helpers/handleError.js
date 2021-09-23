import ß from 'bhala'

import ApiError from '../libs/ApiError'

const { NODE_ENV } = process.env
const IS_PRODUCTION = NODE_ENV === 'production'

const getErrorConstructorName = error => {
  if (error === undefined || error.constructor === undefined) {
    return 'undefined'
  }

  return error.constructor.name
}

/**
 * Handle all kinds of errors. Any error should be caught and handled by this function.
 *
 * @param {*}                               error   Raw error.
 * @param {string}                          path    Exact scope path where this handler was called.
 * @param {import("next").NextApiResponse}  res     Koa context.
 *
 * @example
 * handleError(err, "controllers/MyClass.myMethod()");
 * handleError(err, "helpers/myFunction()");
 * handleError(err, "scripts/myFileName#oneOfTheScriptFunctions()");
 */
export default function handleError(error, path, res) {
  const errorPath = path || 'Unknown Path'

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
      ß.error(`[api/helpers/handleError()] This type of error can't be processed. This should never happen.`, '❌')
      ß.error(`[api/helpers/handleError()] Error Type: ${typeof error}`, '❌')
      ß.error(`[api/helpers/handleError()] Error Constructor: ${getErrorConstructorName(error)}`, '❌')
      errorString = String(error)
  }

  ß.error(`[${errorPath}] ${errorString}`, '❌')

  if (res === undefined) {
    return
  }

  // Unhandled errors are a serious security issue if exposed
  if (IS_PRODUCTION) {
    // But if `error.isExposed` is `true`, that means this is a handled error that can be useful to the client,
    // that's why we want to expose it but exclude the error path
    if (error.isExposed) {
      const code = error.status || 400
      res.status(code).json({
        code,
        hasError: true,
        message: errorString,
      })

      return
    }

    // Otherwise, let's not reveal more than necessary
    const code = 400
    res.status(code).json({
      code,
      hasError: true,
      message: 'Something went wrong.',
    })

    return
  }

  // And in non-production environments, we can reveal (almost) everything
  const code = error.status || 500
  res.status(code).json({
    code,
    hasError: true,
    message: errorString,
    path: errorPath,
  })
}
