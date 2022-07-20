// TODO Explicely import all these left globally declared types.
declare namespace Common {
  namespace App {
    type SelectOption<T = string> = {
      label: string
      value: T
    }
  }

  namespace Auth {
    import type { User as PrismaUser } from '@prisma/client'

    type User = Pick<PrismaUser, 'email' | 'firstName' | 'id' | 'lastName' | 'role'>
  }
}
