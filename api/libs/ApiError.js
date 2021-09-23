export default class ApiError extends Error {
  constructor(message, status, isExposed = false) {
    super(message)

    this.isExposed = isExposed
    this.status = status
  }
}
