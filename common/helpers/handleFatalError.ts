import { handleError } from './handleError'

/**
 * Exit process (with an error code) after handling any passed error.
 */
export function handleFatalError(error: any, path: string): never {
  handleError(error, path)

  process.exit(1)
}
