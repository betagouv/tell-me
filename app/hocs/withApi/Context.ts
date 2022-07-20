import { createContext } from 'react'

import { ApiContext } from './types'

export const Context = createContext<ApiContext>({
  delete: async () => Promise.resolve(null),
  get: async () => Promise.resolve(null),
  patch: async () => Promise.resolve(null),
  post: async () => Promise.resolve(null),
  put: async () => Promise.resolve(null),
})
