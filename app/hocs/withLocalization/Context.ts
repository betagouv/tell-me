import { createContext } from 'react'

import { LocalizationContext } from './types'

export const Context = createContext<LocalizationContext>({
  locale: 'en-US',
  refresh: () => undefined,
})
