import { createContext } from 'react'

const Context = createContext({
  locale: null,
  refresh: () => undefined,
})

export default Context
