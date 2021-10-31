import mongoose from 'mongoose'

export default async () => {
  const collections = await mongoose.connection.db.collections()

  const maybeTokenCollection = collections.find(({ collectionName }) => collectionName === 'tokens')

  if (maybeTokenCollection !== undefined) {
    await maybeTokenCollection.drop()
  }
}
