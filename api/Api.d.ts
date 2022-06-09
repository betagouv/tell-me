declare namespace Api {
  type ResponseBodyFailure = {
    code: number
    hasError: true
    message: string
  }

  type ResponseBodySuccess<T> = {
    data: T
    hasError: false
  }

  type ResponseBody<T = any> = ResponseBodyFailure | ResponseBodySuccess<T>
}
