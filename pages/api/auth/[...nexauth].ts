import getPrisma from '@api/helpers/getPrisma'
import { User } from '@prisma/client'
import { Nexauth, PrismaAdapter } from 'nexauth'

export default Nexauth<User>({
  adapter: new PrismaAdapter({
    prismaInstance: getPrisma(),
  }),
  config: {
    accessTokenPublicUserProps: ['email', 'firstName', 'id', 'lastName', 'role'],
    firstUserDefaultProps: {
      isActive: true,
      role: 'ADMINISTRATOR',
    },
    logInConditions: [user => user.isActive],
    newUserAllowedProps: ['email', 'firstName', 'lastName', 'password'],
  },
})
