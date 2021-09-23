import { createContext } from 'react'

const Context = createContext({
  get: () => undefined,
  post: () => undefined,
})

export default Context
