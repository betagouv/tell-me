import type { JsonObject } from 'type-fest'

export type ApiContext = {
  delete: <T = any>(path: string) => Promise<Api.ResponseBody<T> | null>
  get: <T = any>(path: string) => Promise<Api.ResponseBody<T> | null>
  patch: <T = any>(path: string, data: JsonObject) => Promise<Api.ResponseBody<T> | null>
  post: <T = any>(path: string, data: JsonObject) => Promise<Api.ResponseBody<T> | null>
  put: <T = any>(path: string, formData: BodyInit) => Promise<Api.ResponseBody<T> | null>
}
