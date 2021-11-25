import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'

import getLocale from './getLocale'

import('dayjs/locale/fr')
import('dayjs/locale/en')

dayjs.extend(localeData)
dayjs.extend(relativeTime)

export default function getDayjs(): typeof dayjs {
  const locale = getLocale().substr(0, 2)

  dayjs.locale(locale)

  return dayjs
}
