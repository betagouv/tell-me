import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

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
  const RefreshToken = mongoose.connection.db.collection('refreshtokens')
  const mongoRefreshTokens = (await RefreshToken.find().toArray()).map(mongoRefreshToken => ({
    ...mongoRefreshToken,
    userId: mongoRefreshToken.user.toString(),
  }))
  const postgreUsers = await prismaInstance.user.findMany()

  const postgreRefreshTokens = mongoRefreshTokens.map(({ ip, userId, value }) => {
    const mongoUser = mongoUsers.find(({ id }) => id === userId)
    const postgreUser = postgreUsers.find(({ email }) => email === mongoUser.email)

    return {
      expiredAt: dayjs().add(7, 'day').toDate(),
      ip,
      userId: postgreUser.id,
      value,
    }
  })

  await prismaInstance.refreshToken.createMany({
    data: postgreRefreshTokens,
    skipDuplicates: true,
  })
}
