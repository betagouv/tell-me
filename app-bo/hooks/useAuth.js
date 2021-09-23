import { useContext } from 'react'

import Context from '../components/hocs/withAuth/Context'

/**
 * Provide authentication state and interaction helpers.
 */
export default function useAuth() {
  const contextValue = useContext(Context)

  return contextValue
}
