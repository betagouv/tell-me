import { createContext } from 'react'

import { AuthContext } from './types'

const noop = () => undefined
const anoop = async () => Promise.resolve()

const Context = createContext<AuthContext>({
  clearSessionToken: noop,
  logIn: anoop,
  logOut: noop,
  state: {
    isAuthenticated: false,
    isLoading: false,
    refreshToken: null,
    sessionToken: null,
  },
  user: null,
})

export default Context
