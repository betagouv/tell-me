export default class ApiError extends Error {
  public isExposed: boolean
  public status: number

  constructor(message: string, status: number, isExposed: boolean = false) {
    super(message)

    this.isExposed = isExposed
    this.status = status
  }
}
