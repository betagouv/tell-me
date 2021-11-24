import crypto from 'crypto'
import dayjs from 'dayjs'
import * as R from 'ramda'

import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuth from '../../api/middlewares/withAuth'
import withPrisma from '../../api/middlewares/withPrisma'
import { HandlerWithAuth } from '../../api/types'
import { USER_ROLE } from '../../common/constants'

const ERROR_PATH = 'pages/api/PersonalAccessTokenController()'

const PersonalAccessTokenController: HandlerWithAuth = async (req, res) => {
  if (req.method === undefined || !['DELETE', 'GET', 'POST'].includes(req.method)) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'POST':
      try {
        const newPersonalAccessTokenData = R.pick(['name'], req.body) as {
          name: string
        }
        const expiredAt = dayjs().add(90, 'day').toDate()
        const userId = req.newMe.id
        const value = crypto.randomBytes(32).toString('hex')

        const newPersonalAccessToken = await req.db.personalAccessToken.create({
          data: {
            ...newPersonalAccessTokenData,
            expiredAt,
            userId,
            value,
          },
        })

        res.status(201).json({
          data: newPersonalAccessToken,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'DELETE':
      try {
        const {
          personalAccessTokenId: [personalAccessTokenId],
        } = req.query

        const maybePersonalAccessToken = await req.db.personalAccessToken.findUnique({
          where: {
            id: personalAccessTokenId,
          },
        })
        if (maybePersonalAccessToken === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        await req.db.personalAccessToken.delete({
          where: {
            id: personalAccessTokenId,
          },
        })

        res.status(204).end()
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }
  }
}

export default withPrisma(withAuth(PersonalAccessTokenController, [USER_ROLE.ADMINISTRATOR]))
