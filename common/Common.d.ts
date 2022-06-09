declare namespace Common {
  type AnyProps = {
    [key: string]: any
  }
  type BNS = boolean | number | string | null

  type FunctionLike<R = void | Promise<void>> = () => R

  type FunctionLike<R = void | Promise<void>> = () => R

  /** Make this type nullable */
  type Nullable<T> = T | null

  /** Plain Old Javascript Object */
  type Pojo = Record<string, BNS | BNS[] | Pojo | Pojo[]>

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
