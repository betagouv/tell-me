import { PrismaClient } from '@prisma/client'
import * as R from 'ramda'

/**
 * @param {import('mongoose').Mongoose} mongoose
 */
export default async mongoose => {
  const prismaInstance = new PrismaClient()

  const User = mongoose.connection.db.collection('users')
  const mongoUsers = await User.find().toArray()

  const postgreUsers = R.pipe(
    R.map(mongoUser => ({ ...mongoUser, legacyId: mongoUser._id.toString() })),
    R.map(R.pick(['legacyId', 'role', 'email', 'password', 'isActive', 'createdAt', 'updatedAt'])),
  )(mongoUsers)

  await prismaInstance.user.createMany({
    data: postgreUsers,
    skipDuplicates: true,
  })
}
