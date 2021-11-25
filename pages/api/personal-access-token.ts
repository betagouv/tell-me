import crypto from 'crypto'
import dayjs from 'dayjs'

import handleError from '../../api/helpers/handleError'
import ApiError from '../../api/libs/ApiError'
import withAuth from '../../api/middlewares/withAuth'
import withPrisma from '../../api/middlewares/withPrisma'
import { HandlerWithAuth } from '../../api/types'
import { USER_ROLE } from '../../common/constants'

const ERROR_PATH = 'pages/api/PersonalAccessTokenController()'

const PersonalAccessTokenController: HandlerWithAuth = async (req, res) => {
  if (req.method === undefined || !['DELETE', 'GET', 'PATCH', 'POST'].includes(req.method)) {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'GET':
      try {
        const {
          personalAccessTokenId: [personalAccessTokenId],
        } = req.query

        const maybePersonalAccessToken = await req.db.personalAccessToken.findUnique({
          select: {
            createdAt: true,
            expiredAt: true,
            id: true,
            name: true,
            user: {
              select: {
                email: true,
                firstName: true,
                id: true,
                lastName: true,
              },
            },
          },
          where: {
            id: personalAccessTokenId,
          },
        })
        if (maybePersonalAccessToken === null) {
          handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
        }

        res.status(201).json({
          data: maybePersonalAccessToken,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'POST':
      try {
        const label = String(req.body.label)
        const expiredAt = dayjs().add(90, 'day').toDate()
        const userId = req.me.id
        const value = crypto.randomBytes(32).toString('hex')

        const newPersonalAccessToken = await req.db.personalAccessToken.create({
          data: {
            expiredAt,
            label,
            userId,
            value,
          },
          select: {
            expiredAt: true,
            id: true,
            label: true,
            user: {
              select: {
                email: true,
                firstName: true,
                id: true,
                lastName: true,
              },
            },
            value: true,
          },
        })

        res.status(201).json({
          data: newPersonalAccessToken,
        })
      } catch (err) {
        handleError(err, ERROR_PATH, res)
      }

      return

    case 'PATCH':
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

        const label = String(req.body.label)

        const updatedPersonalAccessToken = await req.db.personalAccessToken.update({
          data: {
            label,
          },
          where: {
            id: personalAccessTokenId,
          },
        })

        res.status(201).json({
          data: updatedPersonalAccessToken,
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
