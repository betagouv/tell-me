type ApiErrorStatus = 400 | 401 | 403 | 404 | 405 | 406 | 422

export class ApiError extends Error {
  public isExposed: boolean
  public status: ApiErrorStatus

  constructor(message: string, status: ApiErrorStatus, isExposed: boolean = false) {
    super(message)

    this.isExposed = isExposed
    this.status = status
  }
}
