import { Options } from 'ky'
import { useMemo } from 'react'

import handleError from '../../helpers/handleError'
import isJwtExpired from '../../helpers/isJwtExpired'
import useAuth from '../../hooks/useAuth'
import api from '../../libs/api'
import Context from './Context'
import { ApiContext } from './types'

export default function withApi(Component) {
  return function WithApi(pageProps) {
    const { refreshSessionToken, state: authState } = useAuth()

    const { sessionToken } = authState
    if (sessionToken !== null) {
      api.updateAuthorizationBearer(sessionToken)
    }

    const handleApiError = async (
      err: any,
      method: string,
      path: string,
      options?: Options,
    ): Promise<Common.Nullable<Api.ResponseBody>> => {
      if (err?.response === undefined) {
        handleError(err, `components/hocs/WithApi#${method}()`)

        return null
      }

      if (err.response.status === 401 && authState.isAuthenticated) {
        if (authState.sessionToken === null) {
          return null
        }

        const isSessionTokenExpired = await isJwtExpired(authState.sessionToken)
        if (!isSessionTokenExpired) {
          return null
        }

        const sessionToken = await refreshSessionToken()
        if (sessionToken === null) {
          return null
        }

        api.updateAuthorizationBearer(sessionToken)
        const body = await api.ky[method](path, options).json()

        return body as Api.ResponseBody
      }

      const body = await err.response.json()

      return body
    }

    const get: ApiContext['get'] = async path => {
      try {
        const body = await api.ky.get(path).json<Api.ResponseBody>()

        return body
      } catch (err) {
        return handleApiError(err, 'get', path)
      }
    }

    const post: ApiContext['post'] = async (path, data) => {
      const options = {
        json: data,
      }

      try {
        const body = await api.ky.post(path, options).json<Api.ResponseBody>()

        return body
      } catch (err) {
        return handleApiError(err, 'post', path)
      }
    }

    const patch: ApiContext['patch'] = async (path, data) => {
      const options = {
        json: data,
      }

      try {
        const body = await api.ky.patch(path, options).json<Api.ResponseBody>()

        return body
      } catch (err) {
        return handleApiError(err, 'patch', path)
      }
    }

    const put: ApiContext['put'] = async (path, formData) => {
      const options = {
        body: formData,
      }

      try {
        const body = await api.ky.put(path, options).json<Api.ResponseBody>()

        return body
      } catch (err) {
        return handleApiError(err, 'put', path)
      }
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _delete: ApiContext['delete'] = async path => {
      const request = api.ky.delete(path)

      try {
        const body = await request.json<Api.ResponseBody>()

        return body
      } catch (err) {
        return handleApiError(err, 'delete', path)
      }
    }

    const providerValue: ApiContext = useMemo(
      () => ({
        delete: _delete,
        get,
        patch,
        post,
        put,
      }),
      [_delete, get, patch, post, put],
    )

    return (
      <Context.Provider value={providerValue}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </Context.Provider>
    )
  }
}
