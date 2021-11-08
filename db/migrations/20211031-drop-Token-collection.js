/**
 * @param {import('mongoose').Mongoose} mongoose
 */
export default async mongoose => {
  const collections = await mongoose.connection.db.collections()

  const maybeTokenCollection = collections.find(({ collectionName }) => collectionName === 'tokens')

  if (maybeTokenCollection !== undefined) {
    await maybeTokenCollection.drop()
  }
}
