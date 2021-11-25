import { PrismaClient } from '@prisma/client'

/**
 * @param {import('mongoose').Mongoose} mongoose
 */
export default async mongoose => {
  const prismaInstance = new PrismaClient()

  const User = mongoose.connection.db.collection('users')
  const mongoUsers = (await User.find().toArray()).map(mongoUser => ({
    ...mongoUser,
    id: mongoUser._id.toString(),
  }))
  const UserConfig = mongoose.connection.db.collection('userconfigs')
  const mongoUserConfigs = (await UserConfig.find().toArray()).map(mongoUserConfig => ({
    ...mongoUserConfig,
    userId: mongoUserConfig.user.toString(),
  }))
  const postgreUsers = await prismaInstance.user.findMany()

  const postgreUserConfigs = mongoUserConfigs.map(({ locale, userId }) => {
    const mongoUser = mongoUsers.find(({ id }) => id === userId)
    const postgreUser = postgreUsers.find(({ email }) => email === mongoUser.email)

    return {
      locale,
      userId: postgreUser.id,
    }
  })

  await prismaInstance.userConfig.createMany({
    data: postgreUserConfigs,
    skipDuplicates: true,
  })
}
