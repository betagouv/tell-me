import { jest } from '@jest/globals'
import { B } from 'bhala'

// eslint-disable-next-line no-console
console.debug = jest.fn()
// eslint-disable-next-line no-console
console.error = jest.fn()
B.error = jest.fn()
