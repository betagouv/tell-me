/* eslint-disable max-classes-per-file */

import ß from 'bhala'

import handleError from './handleError'

describe('app/helpers/handleError()', () => {
  const bhalaError = ß.error

  beforeAll(() => {
    ß.error = jest.fn()
  })

  afterAll(() => {
    ß.error = bhalaError
  })

  test('with a string error', () => {
    const error = 'A string error.'

    handleError(error, `a/path`)

    expect(ß.error).toHaveBeenCalledTimes(2)
    expect(ß.error).toHaveBeenNthCalledWith(1, expect.stringContaining(`[a/path] A string error.`))
    expect(ß.error).toHaveBeenNthCalledWith(2, expect.stringContaining(`A string error.`))
  })

  test('with an instance of Error error', () => {
    const error = new Error(`An Error message.`)

    handleError(error, `a/path`)

    expect(ß.error).toHaveBeenCalledTimes(2)
    expect(ß.error).toHaveBeenNthCalledWith(1, expect.stringContaining(`[a/path] An Error message.`))
    expect(ß.error).toHaveBeenNthCalledWith(2, expect.any(Error))
  })

  test('with an CustomError error', () => {
    class CustomError extends Error {}

    const error = new CustomError(`A CustomError message.`)
    handleError(error, `a/path`)

    expect(ß.error).toHaveBeenCalledTimes(2)
    expect(ß.error).toHaveBeenNthCalledWith(1, expect.stringContaining(`[a/path] A CustomError message.`))
    expect(ß.error).toHaveBeenNthCalledWith(2, expect.any(Error))
  })

  test('with a TooCustomError error', () => {
    class TooCustomError {}

    const error = new TooCustomError()
    handleError(error, `a/path`)

    expect(ß.error).toHaveBeenCalledTimes(5)
    expect(ß.error).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(
        `[app/helpers/handleError()] This type of error can't be processed. This should never happen.`,
      ),
    )
    expect(ß.error).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(`[app/helpers/handleError()] Error Type: object`),
    )
    expect(ß.error).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(`[app/helpers/handleError()] Error Constructor: TooCustomError`),
    )
    expect(ß.error).toHaveBeenNthCalledWith(4, expect.stringContaining(`[a/path] [object Object]`))
    expect(ß.error).toHaveBeenNthCalledWith(5, expect.any(TooCustomError))
  })

  test('with an undefined error', () => {
    handleError(undefined, `a/path`)

    expect(ß.error).toHaveBeenCalledTimes(5)
    expect(ß.error).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(
        `[app/helpers/handleError()] This type of error can't be processed. This should never happen.`,
      ),
    )
    expect(ß.error).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(`[app/helpers/handleError()] Error Type: undefined`),
    )
    expect(ß.error).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(`[app/helpers/handleError()] Error Constructor: undefined`),
    )
    expect(ß.error).toHaveBeenNthCalledWith(4, expect.stringContaining(`[a/path] undefined`))
    expect(ß.error).toHaveBeenNthCalledWith(5, undefined)
  })

  test('with no path', () => {
    handleError(``)

    expect(ß.error).toHaveBeenCalledTimes(2)
    expect(ß.error).toHaveBeenNthCalledWith(1, expect.stringContaining(`[Unknown Path] `))
    expect(ß.error).toHaveBeenNthCalledWith(2, expect.stringContaining(``))
  })
})
