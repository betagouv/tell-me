import handleError from '../../helpers/handleError'
import useAuth from '../../hooks/useAuth'
import api from '../../libs/api'
import Context from './Context'
import { ApiContext } from './types'

const handleApiError = async (err, clearSessionToken, method, isAuthenticated) => {
  if (err?.response === undefined) {
    handleError(err, `components/hocs/WithApi#${method}()`)

    return null
  }

  if (err.response.status === 401 && isAuthenticated) {
    clearSessionToken()

    return null
  }

  const body = await err.response.json()

  return body
}

export default function withApi(Component) {
  return function WithApi(pageProps) {
    const { clearSessionToken, state: authState } = useAuth()

    const { sessionToken } = authState
    if (sessionToken !== null) {
      api.updateAuthorizationBearer(sessionToken)
    }

    const get: ApiContext['get'] = async path => {
      try {
        const body = await api.ky.get(path).json()

        return body
      } catch (err) {
        return handleApiError(err, clearSessionToken, 'get', authState.isAuthenticated)
      }
    }

    const post: ApiContext['post'] = async (path, data) => {
      try {
        const body = await api.ky
          .post(path, {
            json: data,
          })
          .json()

        return body
      } catch (err) {
        return handleApiError(err, clearSessionToken, 'post', authState.isAuthenticated)
      }
    }

    const patch: ApiContext['patch'] = async (path, data) => {
      try {
        const body = await api.ky
          .patch(path, {
            json: data,
          })
          .json()

        return body
      } catch (err) {
        return handleApiError(err, clearSessionToken, 'patch', authState.isAuthenticated)
      }
    }

    const put: ApiContext['put'] = async (path, formData) => {
      try {
        const body = await api.ky
          .put(path, {
            body: formData,
          })
          .json()

        return body
      } catch (err) {
        return handleApiError(err, clearSessionToken, 'patch', authState.isAuthenticated)
      }
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _delete: ApiContext['delete'] = async path => {
      try {
        const body = await api.ky.delete(path).json()

        return body
      } catch (err) {
        return handleApiError(err, clearSessionToken, 'delete', authState.isAuthenticated)
      }
    }

    const providerValue: ApiContext = {
      delete: _delete,
      get,
      patch,
      post,
      put,
    }

    return (
      <Context.Provider value={providerValue}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </Context.Provider>
    )
  }
}