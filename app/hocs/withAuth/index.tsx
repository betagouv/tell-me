import { HTTPError } from 'ky'
import * as R from 'ramda'
import { useEffect, useMemo, useState } from 'react'

import getJwtPayload from '../../helpers/getJwtPayload'
import handleError from '../../helpers/handleError'
import isJwtExpired from '../../helpers/isJwtExpired'
import resetLocalStorage from '../../helpers/resetLocalStorage'
import useIsMounted from '../../hooks/useIsMounted'
import api from '../../libs/api'
import Context from './Context'
import { AuthContext, AuthContextState, AuthContextUser } from './types'

const getInitialState = (): AuthContextState => {
  const maybeRefreshToken = window.localStorage.getItem('refreshToken')
  const maybeSessionToken = window.localStorage.getItem('sessionToken')

  return {
    isAuthenticated: null,
    isLoading: true,
    refreshToken: maybeRefreshToken,
    sessionToken: maybeSessionToken,
  }
}

const getInitialUser = (): AuthContextUser => {
  const maybeUserJson = window.localStorage.getItem('user')
  const maybeUser = maybeUserJson !== null ? JSON.parse(maybeUserJson) : null

  return maybeUser
}

export default function withAuth(Component) {
  return function WithAuth(pageProps) {
    const [state, setState] = useState<AuthContextState>(getInitialState())
    const [user, setUser] = useState<Common.Nullable<AuthContextUser>>(getInitialUser())
    const isMounted = useIsMounted()

    const logIn: AuthContext['logIn'] = async (sessionToken, refreshToken = null) => {
      const sessionTokenPayload = await getJwtPayload(sessionToken)
      if (sessionTokenPayload === null) {
        return
      }

      const user = R.pick(['_id', 'email', 'role'])(sessionTokenPayload)
      const userJson = JSON.stringify(user)

      if (refreshToken !== null) {
        window.localStorage.setItem('refreshToken', refreshToken)
      }
      window.localStorage.setItem('sessionToken', sessionToken)
      window.localStorage.setItem('locale', sessionTokenPayload.locale)
      window.localStorage.setItem('user', userJson)

      if (isMounted()) {
        setUser(user)
        setState({
          ...state,
          isAuthenticated: true,
          refreshToken,
          sessionToken,
        })
      }
    }

    const refreshSessionToken: AuthContext['refreshSessionToken'] = async () => {
      try {
        if (state.refreshToken === null) {
          return null
        }

        const body = await api.ky
          .post('auth/refresh', {
            json: {
              refreshToken: state.refreshToken,
            },
          })
          .json<Api.ResponseBody>()
        if (body === null || body.hasError) {
          return null
        }

        const { sessionToken } = body.data

        window.localStorage.setItem('sessionToken', sessionToken)

        setState({
          ...state,
          sessionToken,
        })

        return sessionToken
      } catch (err) {
        if (err instanceof HTTPError) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          clearSessionToken()
        } else {
          handleError(err, 'app/hocs/withAuth#refreshSessionToken()')
        }

        return null
      }
    }

    // Useful to force a re-login with the email field prefilled
    const clearSessionToken: AuthContext['clearSessionToken'] = () => {
      window.localStorage.removeItem('sessionToken')

      if (isMounted()) {
        setState({
          ...state,
          isAuthenticated: false,
          sessionToken: null,
        })
      }
    }

    const logOut: AuthContext['logOut'] = () => {
      resetLocalStorage()

      if (isMounted()) {
        setState({
          ...state,
          isAuthenticated: false,
          refreshToken: null,
          sessionToken: null,
        })
        setUser(null)
      }
    }

    useEffect(() => {
      if (state.sessionToken === null && isMounted()) {
        setState({
          ...state,
          isAuthenticated: false,
          isLoading: false,
        })

        return
      }

      ;(async () => {
        if (state.sessionToken === null) {
          return
        }

        const isSessionExpired = await isJwtExpired(state.sessionToken)

        if (isSessionExpired) {
          clearSessionToken()
        }

        if (isMounted()) {
          setState({
            ...state,
            isAuthenticated: true,
            isLoading: false,
          })
        }
      })()
    }, [])

    const providerValue: AuthContext = useMemo(
      () => ({
        clearSessionToken,
        logIn,
        logOut,
        refreshSessionToken,
        state,
        user,
      }),
      [clearSessionToken, logIn, logOut, refreshSessionToken, state, user],
    )

    return (
      <Context.Provider value={providerValue}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </Context.Provider>
    )
  }
}
