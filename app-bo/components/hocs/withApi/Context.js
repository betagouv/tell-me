import { createContext } from 'react'

const Context = createContext({
  delete: () => undefined,
  get: () => undefined,
  patch: () => undefined,
  post: () => undefined,
  put: () => undefined,
})

export default Context
