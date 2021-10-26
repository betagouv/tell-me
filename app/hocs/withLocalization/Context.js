import { createContext } from 'react'

const Context = createContext({
  locale: null,
  setLocale: () => undefined,
})

export default Context
