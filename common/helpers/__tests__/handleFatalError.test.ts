import { jest } from '@jest/globals'

import { handleFatalError } from '../handleFatalError'

describe('common/helpers/handleFatalError()', () => {
  const mockedProcessExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never)

  afterAll(() => {
    mockedProcessExit.mockRestore()
  })

  test('with a fatal error', () => {
    const error = 'An error.'
    const path = 'a/path'

    handleFatalError(error, path) as any

    expect(mockedProcessExit).toHaveBeenCalledTimes(1)
    expect(mockedProcessExit).toHaveBeenCalledWith(1)
  })
})
