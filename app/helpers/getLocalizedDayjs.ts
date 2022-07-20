import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

import { getLocale } from './getLocale'

import('dayjs/locale/fr')
import('dayjs/locale/en')

dayjs.extend(localeData)
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.extend(utc)

export function getLocalizedDayjs(): typeof dayjs {
  const locale = getLocale().substring(0, 2)

  dayjs.locale(locale)

  return dayjs
}
