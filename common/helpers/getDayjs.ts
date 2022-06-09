import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

import { getLocale } from './getLocale'

import('dayjs/locale/fr')
import('dayjs/locale/en')

dayjs.extend(localeData)
dayjs.extend(relativeTime)
dayjs.extend(utc)

export function getDayjs(): typeof dayjs {
  const locale = getLocale().substring(0, 2)

  dayjs.locale(locale)

  return dayjs
}
