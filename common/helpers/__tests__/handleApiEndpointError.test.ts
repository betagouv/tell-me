import { ApiError } from '@api/libs/ApiError'
import { jest } from '@jest/globals'

import { SilentError } from '../../libs/SilentError'
import { handleApiEndpointError } from '../handleApiEndpointError'

describe('common/helpers/handleApiEndpointError()', () => {
  const originalProcessEnv = process.env

  const fakeRes: any = {
    json: () => fakeRes,
    status: () => fakeRes,
  }

  const spiedFakeResJson = jest.spyOn(fakeRes, 'json')
  const spiedFakeResStatus = jest.spyOn(fakeRes, 'status')

  afterAll(() => {
    process.env = originalProcessEnv
  })

  describe('in a non-production environment', () => {
    test('with a non-ApiError', () => {
      process.env = {
        ...originalProcessEnv,
        NODE_ENV: 'development',
      }

      const error = 'An error.'
      const path = 'a/path'

      const call = () => handleApiEndpointError(error, path, fakeRes)

      expect(call).toThrowError(SilentError)
      expect(spiedFakeResStatus).toHaveBeenCalledWith(400)
      expect(spiedFakeResJson).toHaveBeenCalledWith({
        code: 400,
        hasError: true,
        message: error,
        path,
      })
    })

    test('with an ApiError', () => {
      process.env = {
        ...originalProcessEnv,
        NODE_ENV: 'development',
      }

      const error = new ApiError('An error.', 400)
      const path = 'a/path'

      const call = () => handleApiEndpointError(error, path, fakeRes)

      expect(call).toThrowError(SilentError)
      expect(spiedFakeResStatus).toHaveBeenCalledWith(400)
      expect(spiedFakeResJson).toHaveBeenCalledWith({
        code: 400,
        hasError: true,
        message: error.message,
        path,
      })
    })

    test('with an exposed ApiError and <res> [NON-PRODUCTION]', () => {
      process.env = {
        ...originalProcessEnv,
        NODE_ENV: 'development',
      }

      const error = new ApiError('An error.', 400, true)
      const path = 'a/path'

      const call = () => handleApiEndpointError(error, path, fakeRes)

      expect(call).toThrowError(SilentError)
      expect(spiedFakeResStatus).toHaveBeenCalledWith(400)
      expect(spiedFakeResJson).toHaveBeenCalledWith({
        code: 400,
        hasError: true,
        message: error.message,
        path,
      })
    })
  })

  describe('in a production environment', () => {
    test('with an Error and', () => {
      process.env = {
        ...originalProcessEnv,
        NODE_ENV: 'production',
      }

      const error = new Error('An error.')
      const path = 'a/path'

      const call = () => handleApiEndpointError(error, path, fakeRes)

      expect(call).toThrowError(SilentError)
      expect(spiedFakeResStatus).toHaveBeenCalledWith(400)
      expect(spiedFakeResJson).toHaveBeenCalledWith({
        code: 400,
        hasError: true,
        message: 'Something went wrong. Please check your server logs.',
      })
    })

    test('with an ApiError', () => {
      process.env = {
        ...originalProcessEnv,
        NODE_ENV: 'production',
      }

      const error = new ApiError('An error.', 400)
      const path = 'a/path'

      const call = () => handleApiEndpointError(error, path, fakeRes)

      expect(call).toThrowError(SilentError)
      expect(spiedFakeResStatus).toHaveBeenCalledWith(400)
      expect(spiedFakeResJson).toHaveBeenCalledWith({
        code: 400,
        hasError: true,
        message: 'Something went wrong. Please check your server logs.',
      })
    })

    test('with an exposed ApiError and a response', () => {
      process.env = {
        ...originalProcessEnv,
        NODE_ENV: 'production',
      }

      const error = new ApiError('An error.', 400, true)
      const path = 'a/path'

      const call = () => handleApiEndpointError(error, path, fakeRes)

      expect(call).toThrowError(SilentError)
      expect(spiedFakeResStatus).toHaveBeenCalledWith(400)
      expect(spiedFakeResJson).toHaveBeenCalledWith({
        code: 400,
        hasError: true,
        message: error.message,
      })
    })
  })
})
