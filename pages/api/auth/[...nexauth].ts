import { prisma } from '@api/libs/prisma'
import { User, UserRole } from '@prisma/client'
import { Nexauth, PrismaAdapter } from 'nexauth'

export default Nexauth<User>({
  adapter: new PrismaAdapter({
    prismaInstance: prisma,
  }),
  config: {
    accessTokenPublicUserProps: ['email', 'firstName', 'id', 'lastName', 'role'],
    firstUserDefaultProps: {
      isActive: true,
      role: UserRole.ADMINISTRATOR,
    },
    logInConditions: [user => user.isActive],
    newUserAllowedProps: ['email', 'firstName', 'lastName', 'password'],
  },
})
