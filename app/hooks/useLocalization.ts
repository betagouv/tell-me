import { useContext } from 'react'

import Context from '../hocs/wLocalization/Context'
import { LocalizationContext } from '../hocs/wLocalization/types'

/**
 * Provide API requesting helpers.
 */
export default function useLocalization(): LocalizationContext {
  const contextValue = useContext(Context)

  return contextValue
}
