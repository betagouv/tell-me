import { useContext } from 'react'

import Context from '../hocs/withApi/Context'

/**
 * Provide API requesting helpers.
 */
export default function useApi() {
  const contextValue = useContext(Context)

  return contextValue
}
