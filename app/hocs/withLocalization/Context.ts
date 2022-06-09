import { createContext } from 'react'

import { LocalizationContext } from './types'

const noop = () => undefined

export const Context = createContext<LocalizationContext>({
  locale: null,
  refresh: noop,
})
