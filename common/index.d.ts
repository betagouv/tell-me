declare namespace Common {
  /**
   * Make this type nullable.
   */
  type Nullable<T> = T | null

  declare namespace Authentication {
    import { JWTPayload } from 'jose-browser-runtime/types'

    interface Payload extends JWTPayload {
      /** User ID */
      _id: string
      /** User email */
      email: string
      /**
       * Expiration date
       *
       * @description
       * Unix timestamp (in seconds)
       */
      exp: number
      /**
       * Creation date
       *
       * @description
       * Unix timestamp (in seconds)
       */
      iat: number
      /** User locale */
      locale: string
      /** User role */
      role: User.Role
    }
  }

  declare namespace User {
    type Role = 'ADMINISTRATOR' | 'MANAGER' | 'VIEWER'
  }
}
