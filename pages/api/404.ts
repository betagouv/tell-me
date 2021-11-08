import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'

const ERROR_PATH = 'pages/api/auth/NotFoundController()'

export default async function NotFoundController(req, res) {
  handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
}
