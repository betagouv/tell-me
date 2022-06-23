/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'

import { getLocalizedDayjs } from '../getLocalizedDayjs'

describe('app/helpers/getLocalizedDayjs()', () => {
  const mockedWindowNavigatorLanguages = jest.spyOn(window.navigator, 'languages', 'get')

  afterAll(() => {
    mockedWindowNavigatorLanguages.mockRestore()
  })

  test('with ["fr"] browser languages', async () => {
    mockedWindowNavigatorLanguages.mockReturnValueOnce(['fr'])

    const dayjs = getLocalizedDayjs()

    expect(dayjs('2022-01-01T23:00:00Z').format('LLLL')).toStrictEqual('samedi 1 janvier 2022 15:00')
  })
})
