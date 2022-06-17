export type ApiContext = {
  delete: <T = any>(path: string) => Promise<Common.Nullable<Api.ResponseBody<T>>>
  get: <T = any>(path: string) => Promise<Common.Nullable<Api.ResponseBody<T>>>
  patch: <T = any>(path: string, data: Common.Pojo | Common.Pojo[]) => Promise<Common.Nullable<Api.ResponseBody<T>>>
  post: <T = any>(path: string, data: Common.Pojo | Common.Pojo[]) => Promise<Common.Nullable<Api.ResponseBody<T>>>
  put: <T = any>(path: string, formData: BodyInit) => Promise<Common.Nullable<Api.ResponseBody<T>>>
}
