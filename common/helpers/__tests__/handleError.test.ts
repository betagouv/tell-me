/* eslint-disable max-classes-per-file */

import { B } from 'bhala'

import { handleError } from '../handleError'

describe('common/helpers/handleError()', () => {
  test('with a string error', () => {
    const error = 'A string error.'

    handleError(error, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(1)
    expect(B.error).toHaveBeenCalledWith('[a/path] A string error.')
  })

  test('with an instance of Error error', () => {
    const error = new Error(`An Error message.`)

    handleError(error, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(1)
    expect(B.error).toHaveBeenCalledWith('[a/path] An Error message.')
  })

  test('with an CustomError error', () => {
    class CustomError extends Error {}

    const error = new CustomError(`A CustomError message.`)
    handleError(error, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(1)
    expect(B.error).toHaveBeenCalledWith('[a/path] A CustomError message.')
  })

  test('with a TooCustomError error', () => {
    class TooCustomError {}

    const error = new TooCustomError()
    handleError(error, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(4)
    expect(B.error).toHaveBeenNthCalledWith(
      1,
      '[common/helpers/handleError()] This type of error cannot be processed. This should never happen.',
    )
    expect(B.error).toHaveBeenNthCalledWith(2, '[common/helpers/handleError()] Error Type: object')
    expect(B.error).toHaveBeenNthCalledWith(3, '[common/helpers/handleError()] Error Constructor: TooCustomError')
    expect(B.error).toHaveBeenNthCalledWith(4, '[a/path] [object Object]')
  })

  test('with an undefined error', () => {
    handleError(undefined, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(4)
    expect(B.error).toHaveBeenNthCalledWith(
      1,
      '[common/helpers/handleError()] This type of error cannot be processed. This should never happen.',
    )
    expect(B.error).toHaveBeenNthCalledWith(2, '[common/helpers/handleError()] Error Type: undefined')
    expect(B.error).toHaveBeenNthCalledWith(3, '[common/helpers/handleError()] Error Constructor: undefined')
    expect(B.error).toHaveBeenNthCalledWith(4, '[a/path] undefined')
  })
})
