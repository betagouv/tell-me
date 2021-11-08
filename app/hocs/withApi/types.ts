export type ApiContext = {
  delete: <T = any>(path: string) => Promise<Api.ResponseBody<T>>
  get: <T = any>(path: string) => Promise<Api.ResponseBody<T>>
  patch: <T = any>(path: string, data: any) => Promise<Api.ResponseBody<T>>
  post: <T = any>(path: string, data: any) => Promise<Api.ResponseBody<T>>
  put: <T = any>(path: string, formData: BodyInit) => Promise<Api.ResponseBody<T>>
}
