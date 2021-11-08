import { createContext } from 'react'

import { ApiContext } from './types'

const anoop = async () => Promise.resolve()

const Context = createContext<ApiContext>({
  delete: anoop,
  get: anoop,
  patch: anoop,
  post: anoop,
  put: anoop,
})

export default Context
