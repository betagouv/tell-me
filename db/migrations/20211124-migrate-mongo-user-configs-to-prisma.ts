import * as R from 'ramda'

import type { PrismaClient } from '@prisma/client'
import type { Mongoose } from 'mongoose'

export default async function migrateMongoUserConfigsToPrisma(mongoose: Mongoose, prisma: PrismaClient) {
  const User = mongoose.connection.db.collection('users')
  const mongoUsers = await User.find().toArray()

  const postgreUsers: any[] = R.map(R.pick(['role', 'email', 'password', 'isActive', 'createdAt', 'updatedAt']))(
    mongoUsers,
  )

  await prisma.user.createMany({
    data: postgreUsers,
    skipDuplicates: true,
  })
}
