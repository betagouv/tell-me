import * as R from 'ramda'
import { useEffect, useState } from 'react'

import getJwtPayload from '../../../helpers/getJwtPayload'
import isJwtExpired from '../../../helpers/isJwtExpired'
import Context from './Context'

const getInitialState = () => {
  const maybeRefreshToken = window.localStorage.getItem('refreshToken')
  const maybeSessionToken = window.localStorage.getItem('sessionToken')

  return {
    isAuthenticated: null,
    isLoading: true,
    refreshToken: maybeRefreshToken,
    sessionToken: maybeSessionToken,
  }
}

const getInitialUser = () => {
  const maybeUserJson = window.localStorage.getItem('user')
  const maybeUser = maybeUserJson !== null ? JSON.parse(maybeUserJson) : null

  return maybeUser
}

export default function withAuth(Component) {
  return function WithAuth(pageProps) {
    const [state, setState] = useState(getInitialState())
    const [user, setUser] = useState(getInitialUser())

    const logIn = async (sessionToken, refreshToken = null) => {
      const sessionTokenPayload = await getJwtPayload(sessionToken)

      const user = R.pick(['_id', 'email', 'role'])(sessionTokenPayload)
      const userJson = JSON.stringify(user)

      if (refreshToken !== null) {
        window.localStorage.setItem('refreshToken', refreshToken)
      }
      window.localStorage.setItem('sessionToken', sessionToken)
      window.localStorage.setItem('user', userJson)

      setState({
        ...state,
        isAuthenticated: true,
        refreshToken,
        sessionToken,
      })
      setUser(user)
    }

    // Useful to force a re-login with the email field prefilled
    const clearSessionToken = () => {
      window.localStorage.removeItem('sessionToken')

      setState({
        ...state,
        isAuthenticated: false,
        sessionToken: null,
      })
    }

    const logOut = () => {
      window.localStorage.clear()

      setState({
        ...state,
        isAuthenticated: false,
        refreshToken: null,
        sessionToken: null,
      })
      setUser(null)
    }

    const providerValue = {
      clearSessionToken,
      logIn,
      logOut,
      state,
      user,
    }

    useEffect(() => {
      if (state.sessionToken === null) {
        setState({
          ...state,
          isAuthenticated: false,
          isLoading: false,
        })

        return
      }

      ;(async () => {
        const isSessionExpired = await isJwtExpired(state.sessionToken)

        if (isSessionExpired) {
          clearSessionToken()
        }

        setState({
          ...state,
          isAuthenticated: true,
          isLoading: false,
        })
      })()

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <Context.Provider value={providerValue}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </Context.Provider>
    )
  }
}
