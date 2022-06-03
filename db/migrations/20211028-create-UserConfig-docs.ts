import type { Mongoose } from 'mongoose'

export default async function createUserConfig(mongoose: Mongoose) {
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
        createdAt: now,
        locale: 'en-US',
        updatedAs: now,
        user: user._id,
      })
    }
  }
}
