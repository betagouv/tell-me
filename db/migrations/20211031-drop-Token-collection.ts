import type { Mongoose } from 'mongoose'

export default async function dropTokenCollection(mongoose: Mongoose) {
  const collections = await mongoose.connection.db.collections()

  const maybeTokenCollection = collections.find(({ collectionName }) => collectionName === 'tokens')

  if (maybeTokenCollection !== undefined) {
    await maybeTokenCollection.drop()
  }
}
