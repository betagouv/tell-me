/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'

import { getLocale } from '../getLocale'

describe('app/helpers/getLocale()', () => {
  const mockedWindowDocumentCookie = jest.spyOn(window.document, 'cookie', 'get')
  const mockedWindowNavigatorLanguages = jest.spyOn(window.navigator, 'languages', 'get')

  afterAll(() => {
    mockedWindowDocumentCookie.mockRestore()
    mockedWindowNavigatorLanguages.mockRestore()
  })

  test(`with ${JSON.stringify(window.navigator.languages)} browser languages`, async () => {
    const result = getLocale()

    expect(result).toStrictEqual('en-US')
  })

  test(`with ["zz"] browser languages`, async () => {
    mockedWindowNavigatorLanguages.mockReturnValueOnce(['zz'])

    const result = getLocale()

    expect(result).toStrictEqual('en-US')
  })

  describe('with ["fr", "en"] browser languages', () => {
    beforeEach(() => {
      mockedWindowNavigatorLanguages.mockReturnValueOnce(['fr', 'en'])
    })

    test('and no cookie', async () => {
      const result = getLocale()

      expect(result).toStrictEqual('fr-FR')
    })

    test('and "en-US" TELL_ME_LOCALE cookie', async () => {
      mockedWindowDocumentCookie.mockReturnValue('TELL_ME_LOCALE=en-US')

      const result = getLocale()

      expect(result).toStrictEqual('en-US')
    })

    test('and "zz" TELL_ME_LOCALE cookie', async () => {
      mockedWindowDocumentCookie.mockReturnValue('TELL_ME_LOCALE=zz')

      const result = getLocale()

      expect(result).toStrictEqual('fr-FR')
    })
  })
})
