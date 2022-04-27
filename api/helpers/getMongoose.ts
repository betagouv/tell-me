import mongoose, { Mongoose } from 'mongoose'

import handleError from '../../app/helpers/handleError'

const { DB_URL } = process.env

function getMongooseSingleton() {
  let mongooseInstance: Common.Nullable<Mongoose> = null

  return async function getMongoose() {
    try {
      if (DB_URL === undefined) {
        throw new Error('`process.env.DB_URL` is undefined.')
      }

      if (mongooseInstance === null) {
        mongooseInstance = await mongoose.connect(DB_URL, {
          connectTimeoutMS: 5000,
        })
      }

      return mongooseInstance
    } catch (err) {
      return handleError(err, 'server/getMongoose()')
    }
  }
}

export default getMongooseSingleton()
