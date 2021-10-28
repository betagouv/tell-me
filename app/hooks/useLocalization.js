import { useContext } from 'react'

import Context from '../hocs/withLocalization/Context'

/**
 * Provide API requesting helpers.
 */
export default function useLocalization() {
  const contextValue = useContext(Context)

  return contextValue
}
