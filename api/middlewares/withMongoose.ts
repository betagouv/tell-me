import mongoose, { Mongoose } from 'mongoose'
import { NextApiHandler } from 'next'

import handleError from '../helpers/handleError'
import ApiError from '../libs/ApiError'

mongoose.Schema.Types.String.checkRequired(value => typeof value === 'string')

const { DB_URL } = process.env

function withMongooseSingleton() {
  let mongooseInstance: Common.Nullable<Mongoose> = null

  return function withMongoose(handler: NextApiHandler): NextApiHandler<Api.ResponseWithMongoose> {
    return async (req, res) => {
      try {
        if (mongooseInstance === null) {
          if (DB_URL === undefined) {
            throw new ApiError('`process.env.DB_URL` is undefined.', 500)
          }

          mongooseInstance = await mongoose.connect(DB_URL, {
            connectTimeoutMS: 5000,
          })
        }

        ;(req as Api.ResponseWithMongoose).db = mongooseInstance

        return await handler(req, res)
      } catch (err) {
        return handleError(err, 'middlewares/withMongoose()', res)
      }
    }
  }
}

export default withMongooseSingleton()