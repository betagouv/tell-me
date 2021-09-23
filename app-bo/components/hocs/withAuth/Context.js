import { createContext } from 'react'

const Context = createContext({
  clearSessionToken: () => undefined,
  logIn: () => undefined,
  logOut: () => undefined,
  state: {
    isAuthenticated: false,
    refreshToken: null,
    sessionToken: null,
  },
  user: null,
})

export default Context
