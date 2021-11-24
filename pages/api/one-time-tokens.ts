import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuth from '../../api/middlewares/withAuth'
import withMongoose from '../../api/middlewares/withMongoose'
import withPrisma from '../../api/middlewares/withPrisma'
import OneTimeToken from '../../api/models/OneTimeToken'
import { USER_ROLE } from '../../common/constants'

const ERROR_PATH = 'pages/api/OneTimeTokensController()'

async function OneTimeTokensController(req, res) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const oneTimeTokens = await OneTimeToken.find().populate('user').exec()

    res.status(200).json({
      data: oneTimeTokens,
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withPrisma(withMongoose(withAuth(OneTimeTokensController, [USER_ROLE.ADMINISTRATOR])))
