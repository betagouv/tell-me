import dayjs from 'dayjs'

import type { PrismaClient } from '@prisma/client'
import type { Mongoose } from 'mongoose'

export default async function migrateMongoRefreshTokensToPrisma(mongoose: Mongoose, prisma: PrismaClient) {
  const User = mongoose.connection.db.collection('users')
  const mongoUsers = (await User.find().toArray()).map(mongoUser => ({
    ...mongoUser,
    id: mongoUser._id.toString(),
  }))
  const RefreshToken = mongoose.connection.db.collection('refreshtokens')
  const mongoRefreshTokens: any[] = (await RefreshToken.find().toArray()).map(mongoRefreshToken => ({
    ...mongoRefreshToken,
    userId: mongoRefreshToken.user.toString(),
  }))
  const postgreUsers = await prisma.user.findMany()

  const postgreRefreshTokens = mongoRefreshTokens.map(({ ip, userId, value }) => {
    const mongoUser = mongoUsers.find(({ id }) => id === userId) as any
    const postgreUser = postgreUsers.find(({ email }) => email === mongoUser.email) as any

    return {
      expiredAt: dayjs().add(7, 'day').toDate(),
      ip,
      userId: postgreUser.id,
      value,
    }
  })

  await prisma.refreshToken.createMany({
    data: postgreRefreshTokens,
    skipDuplicates: true,
  })
}
