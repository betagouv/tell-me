import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuth from '../../api/middlewares/withAuth'
import withMongoose from '../../api/middlewares/withMongoose'
import OneTimeToken from '../../api/models/OneTimeToken'
import { USER_ROLE } from '../../common/constants'

const ERROR_PATH = 'pages/api/OneTimeTokenController()'

async function OneTimeTokenController(req, res) {
  if (!['DELETE'].includes(req.method)) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'DELETE':
      try {
        const {
          oneTimeTokenId: [oneTimeTokenId],
        } = req.query

        const maybeSurvey = await OneTimeToken.findById(oneTimeTokenId).exec()
        if (maybeSurvey === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        await OneTimeToken.findByIdAndDelete(oneTimeTokenId)

        res.status(204).end()
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }
  }
}

export default withMongoose(withAuth(OneTimeTokenController, [USER_ROLE.ADMINISTRATOR]))
