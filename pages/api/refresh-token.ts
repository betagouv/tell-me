import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuth from '../../api/middlewares/withAuth'
import withMongoose from '../../api/middlewares/withMongoose'
import RefreshToken from '../../api/models/RefreshToken'
import { USER_ROLE } from '../../common/constants'

const ERROR_PATH = 'pages/api/RefreshTokenController()'

async function RefreshTokenController(req, res) {
  if (!['DELETE'].includes(req.method)) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'DELETE':
      try {
        const {
          refreshTokenId: [refreshTokenId],
        } = req.query

        const maybeSurvey = await RefreshToken.findById(refreshTokenId).exec()
        if (maybeSurvey === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        await RefreshToken.findByIdAndDelete(refreshTokenId)

        res.status(204).end()
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }
  }
}

export default withMongoose(withAuth(RefreshTokenController, [USER_ROLE.ADMINISTRATOR]))
