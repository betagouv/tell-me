/**
 * @jest-environment jsdom
 */

import { capitalizeFirstLetter } from '../capitalizeFirstLetter'

describe('app/helpers/capitalizeFirstLetter()', () => {
  test('with "élan"', async () => {
    const text = 'élan'

    const result = capitalizeFirstLetter(text)

    expect(result).toStrictEqual('Élan')
  })
})
