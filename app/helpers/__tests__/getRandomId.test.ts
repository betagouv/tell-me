/**
 * @jest-environment jsdom
 */

import crypto from 'crypto'

// TODO Repleace this polyfill once this is fixed: https://github.com/jsdom/jsdom/issues/1612.
window.crypto = {
  getRandomValues: (buffer: any) => crypto.randomFillSync(buffer),
} as any

// eslint-disable-next-line import/first
import { getRandomId } from '../getRandomId'

test('app/helpers/getRandomId()', () => {
  const result = getRandomId()

  expect(typeof result).toStrictEqual('string')
  expect(result).toMatch(/^\d{10}$/)
})
