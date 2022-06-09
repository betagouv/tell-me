import { useContext } from 'react'

import { Context } from '../hocs/withApi/Context'
import { ApiContext } from '../hocs/withApi/types'

/**
 * Provide API requesting helpers.
 */
export function useApi(): ApiContext {
  const contextValue = useContext(Context)

  return contextValue
}
