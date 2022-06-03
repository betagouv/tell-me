import { useContext } from 'react'

import Context from '../hocs/WithLocalization/Context'
import { LocalizationContext } from '../hocs/WithLocalization/types'

/**
 * Provide API requesting helpers.
 */
export default function useLocalization(): LocalizationContext {
  const contextValue = useContext(Context)

  return contextValue
}
