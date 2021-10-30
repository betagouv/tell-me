import { createContext } from 'react'

const anoop = async () => Promise.resolve()

const Context = createContext({
  delete: anoop,
  get: anoop,
  patch: anoop,
  post: anoop,
  put: anoop,
})

export default Context
