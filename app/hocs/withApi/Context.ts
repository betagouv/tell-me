import { createContext } from 'react'

import { ApiContext } from './types'

const anoop = async () => Promise.resolve()

export const Context = createContext<ApiContext>({
  delete: anoop as any,
  get: anoop as any,
  patch: anoop as any,
  post: anoop as any,
  put: anoop as any,
})
