import type { LocaleValue } from '@common/constants'
import type { Promisable } from 'type-fest'

export type LocalizationContext = {
  locale: LocaleValue
  refresh: (newLocale: LocaleValue) => Promisable<void>
}
