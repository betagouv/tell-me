import { getUserLocales } from 'get-user-locale'
import * as R from 'ramda'

import { LOCALE, LOCALES } from '../constants'
import { isBrowser } from './isBrowser'

export function getLocale(): string {
  if (!isBrowser()) {
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
