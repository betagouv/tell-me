import handleError from '../../api/helpers/handleError'
import isReady from '../../api/helpers/isReady'
import ApiError from '../../api/libs/ApiError'
import withMongoose from '../../api/middlewares/withMongoose'

const { npm_package_version: VERSION } = process.env
const ERROR_PATH = 'pages/api/auth/IndexController()'

async function IndexController(req, res) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  const data: any = {
    version: VERSION,
  }
  data.isReady = await isReady()

  res.status(200).json({ data })

  // eslint-disable-next-line consistent-return
  return undefined
}

export default withMongoose(IndexController)
