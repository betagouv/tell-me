import { useContext } from 'react'

import Context from '../hocs/withAuth/Context'
import { AuthContext } from '../hocs/withAuth/types'

/**
 * Provide authentication state and interaction helpers.
 */
export default function useAuth(): AuthContext {
  const contextValue = useContext(Context)

  return contextValue
}
