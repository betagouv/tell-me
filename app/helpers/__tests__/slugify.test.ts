/**
 * @jest-environment jsdom
 */

import { slugify } from '../slugify'

describe('app/helpers/slugify()', () => {
  test('with a complex string', () => {
    const text = ' - A "strange" string with ?@!# CHARS '

    const result = slugify(text)
    expect(result).toEqual('a-strange-string-with-chars')
  })

  test(`with 'Épatant`, () => {
    const text = 'Épatant'

    const result = slugify(text)
    expect(result).toEqual('epatant')
  })

  test(`with an id`, () => {
    const text = 'A text'
    const id = '42'

    const result = slugify(text, id)
    expect(result).toEqual('a-text-42')
  })
})
