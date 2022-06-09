import ky from 'ky'
import { useAuth } from 'nexauth/client'
import { useMemo } from 'react'

import Context from './Context'

import type { ApiContext } from './types'

const API_BASE_URL = '/api'

export default function withApi(Component) {
  return function WithApi(pageProps) {
    const auth = useAuth<Common.Auth.User>()

    const providerValue: ApiContext = useMemo(() => {
      const kyIntance = ky.create({
        headers: {
          authorization: `Bearer ${auth.state.accessToken}`,
        },
        prefixUrl: API_BASE_URL,
      })

      const get = async path => {
        try {
          const body = await kyIntance.get(path).json<Api.ResponseBody>()

          return body
        } catch (err) {
          return null
        }
      }

      const post = async (path, data) => {
        const options = {
          json: data,
        }

        try {
          const body = await kyIntance.post(path, options).json<Api.ResponseBody>()

          return body
        } catch (err) {
          return null
        }
      }

      const patch = async (path, data) => {
        const options = {
          json: data,
        }

        try {
          const body = await kyIntance.patch(path, options).json<Api.ResponseBody>()

          return body
        } catch (err) {
          return null
        }
      }

      const put = async (path, formData) => {
        const options = {
          body: formData,
        }

        try {
          const body = await kyIntance.put(path, options).json<Api.ResponseBody>()

          return body
        } catch (err) {
          return null
        }
      }

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _delete = async path => {
        const request = kyIntance.delete(path)

        try {
          const body = await request.json<Api.ResponseBody>()

          return body
        } catch (err) {
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
