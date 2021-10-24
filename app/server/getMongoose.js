import mongoose from 'mongoose'

import handleError from '../helpers/handleError'

const { DB_URL } = process.env

function getMongooseSingleton() {
  let mongooseInstance = null

  return async function getMongoose() {
    try {
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
