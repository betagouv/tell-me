import ß from 'bhala'

const getErrorConstructorName = error => {
  if (error === undefined || error.constructor === undefined) {
    return 'undefined'
  }

  return error.constructor.name
}

/**
 * Handle all kinds of errors. Any error should be caught and handled by this function.
 *
 * @example
 * handleError(err, "controllers/MyClass.myMethod()");
 * handleError(err, "helpers/myFunction()");
 * handleError(err, "scripts/myFileName#oneOfTheScriptFunctions()");
 */
export default function handleError(error: any, path?: string): void {
  const errorPath = path || 'Unknown Path'

  let errorString
  switch (true) {
    case typeof error === 'string':
      errorString = error
      break

    case error instanceof Error:
      errorString = error.message
      break

    default:
      ß.error(`[app/helpers/handleError()] This type of error can't be processed. This should never happen.`)
      ß.error(`[app/helpers/handleError()] Error Type: ${typeof error}`)
      ß.error(`[app/helpers/handleError()] Error Constructor: ${getErrorConstructorName(error)}`)
      errorString = String(error)
  }

  ß.error(`[${errorPath}] ${errorString}`)
}
