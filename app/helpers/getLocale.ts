import { Cookie, LOCALE, LOCALES } from '@common/constants'
import jsCookie from 'js-cookie'
import * as R from 'ramda'

import type { LocaleKey, LocaleValue } from '@common/constants'

const filterSupportedLocales: (locales: Readonly<string[]>) => LocaleKey[] = R.intersection<any>(LOCALES)

export function getLocale(): LocaleValue {
  const cookieLocale = jsCookie.get(Cookie.TELL_ME_LOCALE)
  if (cookieLocale && R.includes(cookieLocale, LOCALES)) {
    return cookieLocale as LocaleValue
  }

  const browserLocales = window.navigator.languages
  const supportedBrowserLocales = filterSupportedLocales(browserLocales)

  if (supportedBrowserLocales.length > 0) {
    return LOCALE[supportedBrowserLocales[0]]
  }

  return 'en-US'
}
