import jsCookie from 'js-cookie'

import { LOCALE } from '../constants'

export function getLocale(): string {
  const cookieLocale = jsCookie.get('LOCALE') ?? 'en-US'
  if (LOCALE[cookieLocale] === undefined) {
    return 'en-US'
  }

  return cookieLocale
}
