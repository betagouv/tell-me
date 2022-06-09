/* eslint-disable max-classes-per-file, no-console */

import { ApiError } from '@api/libs/ApiError'
import { jest } from '@jest/globals'
import { B } from 'bhala'

import type { NextApiResponse } from 'next'

// eslint-disable-next-line import/first, import/order
import { handleError } from '../handleError'

describe('common/helpers/handleError()', () => {
  const originalProcessEnv = process.env

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockedProcessExit = jest.spyOn(process, 'exit').mockImplementation((code?: number) => undefined as never)

  const fakeRes = {
    json: () => fakeRes,
    status: () => fakeRes,
  }

  const spiedFakeResJson = jest.spyOn(fakeRes, 'json')
  const spiedFakeResStatus = jest.spyOn(fakeRes, 'status')

  beforeAll(() => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'production',
    }
  })

  afterAll(() => {
    process.env = originalProcessEnv

    mockedProcessExit.mockRestore()
  })

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

  test('with <isFinal>=false', () => {
    handleError('An error.', `a/path`, false)

    expect(mockedProcessExit).not.toHaveBeenCalled()
  })

  test('with <isFinal>=true', () => {
    handleError('An error.', `a/path`, true) as undefined

    expect(mockedProcessExit).toHaveBeenCalledTimes(1)
    expect(mockedProcessExit).toHaveBeenCalledWith(1)
  })

  test('with a non-ApiError and <res> [NON-PRODUCTION]', () => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'development',
    }

    handleError('An error.', `a/path`, fakeRes as unknown as NextApiResponse) as undefined

    expect(spiedFakeResStatus).toHaveBeenCalledWith(500)
    expect(spiedFakeResJson).toHaveBeenCalledWith({
      code: 500,
      hasError: true,
      message: 'An error.',
      path: 'a/path',
    })
  })

  test('with a non-exposed 500 ApiError and <res> [NON-PRODUCTION]', () => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'development',
    }

    handleError(new ApiError('An error.', 500), `a/path`, fakeRes as unknown as NextApiResponse) as undefined

    expect(spiedFakeResStatus).toHaveBeenCalledWith(500)
    expect(spiedFakeResJson).toHaveBeenCalledWith({
      code: 500,
      hasError: true,
      message: 'An error.',
      path: 'a/path',
    })
  })

  test('with an exposed 400 ApiError and <res> [NON-PRODUCTION]', () => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'development',
    }

    handleError(new ApiError('An error.', 400, true), `a/path`, fakeRes as unknown as NextApiResponse) as undefined

    expect(spiedFakeResStatus).toHaveBeenCalledWith(400)
    expect(spiedFakeResJson).toHaveBeenCalledWith({
      code: 400,
      hasError: true,
      message: 'An error.',
      path: 'a/path',
    })
  })

  test('with a non-ApiError and <res> [PRODUCTION]', () => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'production',
    }

    handleError('An error.', `a/path`, fakeRes as unknown as NextApiResponse) as undefined

    expect(spiedFakeResStatus).toHaveBeenCalledWith(400)
    expect(spiedFakeResJson).toHaveBeenCalledWith({
      code: 400,
      hasError: true,
      message: 'Something went wrong.',
    })
  })

  test('with a non-exposed 500 ApiError and <res> [PRODUCTION]', () => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'production',
    }

    handleError(new ApiError('An error.', 500), `a/path`, fakeRes as unknown as NextApiResponse) as undefined

    expect(spiedFakeResStatus).toHaveBeenCalledWith(400)
    expect(spiedFakeResJson).toHaveBeenCalledWith({
      code: 400,
      hasError: true,
      message: 'Something went wrong.',
    })
  })

  test('with an exposed 400 ApiError and <res> [PRODUCTION]', () => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'production',
    }

    handleError(new ApiError('An error.', 400, true), `a/path`, fakeRes as unknown as NextApiResponse) as undefined

    expect(spiedFakeResStatus).toHaveBeenCalledWith(400)
    expect(spiedFakeResJson).toHaveBeenCalledWith({
      code: 400,
      hasError: true,
      message: 'An error.',
    })
  })
})
