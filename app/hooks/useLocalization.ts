import { useContext } from 'react'

import { Context } from '../hocs/withLocalization/Context'
import { LocalizationContext } from '../hocs/withLocalization/types'

/**
 * Provide API requesting helpers.
 */
export function useLocalization(): LocalizationContext {
  const contextValue = useContext(Context)

  return contextValue
}
