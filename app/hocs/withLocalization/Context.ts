import { createContext } from 'react'

import { LocalizationContext } from './types'

const noop = () => undefined

const Context = createContext<LocalizationContext>({
  locale: null,
  refresh: noop,
})

export default Context