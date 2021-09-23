/* eslint-disable max-classes-per-file, no-console */

import handleError from './handleError'

describe('app-bo/helpers/handleError()', () => {
  const consoleError = console.error

  beforeAll(() => {
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = consoleError
  })

  test('with a string error', () => {
    const error = 'A string error.'

    handleError(error, `a/path`)

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`[a/path] A string error.`))
  })

  test('with an instance of Error error', () => {
    const error = new Error(`An Error message.`)

    handleError(error, `a/path`)

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`[a/path] An Error message.`))
  })

  test('with an CustomError error', () => {
    class CustomError extends Error {}

    const error = new CustomError(`A CustomError message.`)
    handleError(error, `a/path`)

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`[a/path] A CustomError message.`))
  })

  test('with a TooCustomError error', () => {
    class TooCustomError {}

    const error = new TooCustomError()
    handleError(error, `a/path`)

    expect(console.error).toHaveBeenCalledTimes(4)
    expect(console.error).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(
        `[app-bo/helpers/handleError()] This type of error can't be processed. This should never happen.`,
      ),
    )
    expect(console.error).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(`[app-bo/helpers/handleError()] Error Type: object`),
    )
    expect(console.error).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(`[app-bo/helpers/handleError()] Error Constructor: TooCustomError`),
    )
    expect(console.error).toHaveBeenNthCalledWith(4, expect.stringContaining(`[a/path] [object Object]`))
  })

  test('with an undefined error', () => {
    handleError(undefined, `a/path`)

    expect(console.error).toHaveBeenCalledTimes(4)
    expect(console.error).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(
        `[app-bo/helpers/handleError()] This type of error can't be processed. This should never happen.`,
      ),
    )
    expect(console.error).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(`[app-bo/helpers/handleError()] Error Type: undefined`),
    )
    expect(console.error).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(`[app-bo/helpers/handleError()] Error Constructor: undefined`),
    )
    expect(console.error).toHaveBeenNthCalledWith(4, expect.stringContaining(`[a/path] undefined`))
  })

  test('with no path', () => {
    handleError(``)

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`[Unknown Path] `))
  })
})
