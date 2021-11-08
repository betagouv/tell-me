import { getUserLocales } from 'get-user-locale'
import * as R from 'ramda'

import { LOCALE, LOCALES } from '../../common/constants'

export default function getLocale(): string {
  if (!process.browser) {
    return 'en-US'
  }

  const maybeLocalStorageLocale = window.localStorage.getItem('locale')

  if (maybeLocalStorageLocale !== null) {
    return maybeLocalStorageLocale
  }

  const browserLocales = getUserLocales()
  const supportedBrowserLocales = R.intersection(browserLocales, LOCALES)
  if (supportedBrowserLocales.length === 0) {
    return 'en-US'
  }

  return LOCALE[supportedBrowserLocales[0]]
}
