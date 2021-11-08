/* eslint-disable no-await-in-loop, no-restricted-syntax, sort-keys-fix/sort-keys-fix */

/**
 * @param {import('mongoose').Mongoose} mongoose
 */
export default async mongoose => {
  const User = mongoose.connection.db.collection('users')
  const users = await User.find().toArray()

  const UserConfig = mongoose.connection.db.collection('userconfigs')

  for (const user of users) {
    const maybeUserConfig = await UserConfig.findOne({
      user: user._id,
    })

    if (maybeUserConfig === null) {
      const now = new Date()

      await UserConfig.insertOne({
        user: user._id,
        locale: 'en-US',
        createdAt: now,
        updatedAs: now,
      })
    }
  }
}
