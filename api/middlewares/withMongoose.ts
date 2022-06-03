import { handleError } from '@common/helpers/handleError'
import mongoose from 'mongoose'

import ApiError from '../libs/ApiError'

import type { Mongoose } from 'mongoose'
import type { NextApiHandler } from 'next'

mongoose.Schema.Types.String.checkRequired(value => typeof value === 'string')

const { DB_URL } = process.env

function withMongooseSingleton() {
  let mongooseInstance: Common.Nullable<Mongoose> = null

  return function withMongoose(handler: any): NextApiHandler {
    const handlerWithMongoose: NextApiHandler = async (req, res) => {
      try {
        if (mongooseInstance === null) {
          if (DB_URL === undefined) {
            throw new ApiError('`process.env.DB_URL` is undefined.', 500)
          }

          mongooseInstance = await mongoose.connect(DB_URL, {
            connectTimeoutMS: 5000,
          })
        }

        return (await handler(req, res)) as NextApiHandler
      } catch (err) {
        return handleError(err, 'api/middlewares/handlerWithMongoose()', res)
      }
    }

    return handlerWithMongoose
  }
}

export default withMongooseSingleton()
