import mongoose from 'mongoose'

import handleError from '../helpers/handleError'

const { DB_URL } = process.env

function withMongooseSingleton() {
  let mongooseInstance = null

  return function withMongoose(handler) {
    return async (req, res) => {
      try {
        if (mongooseInstance === null) {
          mongooseInstance = await mongoose.connect(DB_URL, {
            connectTimeoutMS: 5000,
          })
        }

        req.db = mongooseInstance

        return handler(req, res)
      } catch (err) {
        return handleError(err, 'middlewares/withMongoose()', res)
      }
    }
  }
}

export default withMongooseSingleton()
