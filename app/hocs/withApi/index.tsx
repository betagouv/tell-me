import ky, { HTTPError } from 'ky'
import { useAuth } from 'nexauth/client'
import { useMemo } from 'react'

import { Context } from './Context'

import type { ApiContext } from './types'
import type { AppProps } from 'next/app'
import type { JsonObject } from 'type-fest'

const API_BASE_URL = '/api'

export function withApi(Component: AppProps['Component']) {
  return function WithApi(pageProps: AppProps['pageProps']) {
    const auth = useAuth<Common.Auth.User>()

    const providerValue: ApiContext = useMemo(() => {
      const kyIntance = ky.create({
        headers: {
          authorization: `Bearer ${auth.state.accessToken}`,
        },
        prefixUrl: API_BASE_URL,
      })

      async function get<T = any>(path: string): Promise<Api.ResponseBody<T> | null> {
        try {
          const body = await kyIntance.get(path).json<Api.ResponseBodySuccess<T>>()

          return body
        } catch (err) {
          if (err instanceof HTTPError) {
            try {
              const bodyError: Api.ResponseBodyFailure = await err.response.json()

              return bodyError
            } catch (errBis) {
              return null
            }
          }

          return null
        }
      }

      async function post<T = any>(path: string, data: JsonObject): Promise<Api.ResponseBody<T> | null> {
        try {
          const options = {
            json: data,
          }
          const body = await kyIntance.post(path, options).json<Api.ResponseBodySuccess<T>>()

          return body
        } catch (err) {
          if (err instanceof HTTPError) {
            try {
              const bodyError: Api.ResponseBodyFailure = await err.response.json()

              return bodyError
            } catch (errBis) {
              return null
            }
          }

          return null
        }
      }

      async function patch<T = any>(path: string, data: JsonObject): Promise<Api.ResponseBody<T> | null> {
        try {
          const options = {
            json: data,
          }
          const body = await kyIntance.patch(path, options).json<Api.ResponseBodySuccess<T>>()

          return body
        } catch (err) {
          if (err instanceof HTTPError) {
            try {
              const bodyError: Api.ResponseBodyFailure = await err.response.json()

              return bodyError
            } catch (errBis) {
              return null
            }
          }

          return null
        }
      }

      async function put<T = any>(path: string, formData: BodyInit): Promise<Api.ResponseBody<T> | null> {
        try {
          const options = {
            body: formData,
          }
          const body = await kyIntance.put(path, options).json<Api.ResponseBodySuccess<T>>()

          return body
        } catch (err) {
          if (err instanceof HTTPError) {
            try {
              const bodyError: Api.ResponseBodyFailure = await err.response.json()

              return bodyError
            } catch (errBis) {
              return null
            }
          }

          return null
        }
      }

      // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
      async function _delete<T = any>(path: string): Promise<Api.ResponseBody<T> | null> {
        try {
          const body = await kyIntance.delete(path).json<Api.ResponseBodySuccess<T>>()

          return body
        } catch (err) {
          if (err instanceof HTTPError) {
            try {
              const bodyError: Api.ResponseBodyFailure = await err.response.json()

              return bodyError
            } catch (errBis) {
              return null
            }
          }

          return null
        }
      }

      return {
        delete: _delete,
        get,
        patch,
        post,
        put,
      }
    }, [auth.state.accessToken])

    return (
      <Context.Provider value={providerValue}>
        <Component {...pageProps} />
      </Context.Provider>
    )
  }
}
