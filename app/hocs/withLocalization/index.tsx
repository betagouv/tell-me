import { getLocale } from '@common/helpers/getLocale'
import { handleError } from '@common/helpers/handleError'
import jsCookie from 'js-cookie'
import { useCallback, useMemo, useState } from 'react'
import { IntlProvider } from 'react-intl'

import enUS from '../../../locales/compiled/en-US.json'
import frFR from '../../../locales/compiled/fr-FR.json'
import { Context } from './Context'
import { LocalizationContext } from './types'

export function loadLocaleMessages(locale: string) {
  switch (locale) {
    case 'en-US':
      return enUS

    case 'fr-FR':
      return frFR

    default:
      return enUS
  }
}

function onIntlProviderError(err) {
  // We ignore missing translations errors in non-production environments to avoid cluttering logs:
  if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production' && err.code === 'MISSING_TRANSLATION') {
    return
  }

  handleError(err, 'components/withLocalization#onIntlProviderError()')
}

export function WithLocalization({ children }) {
  const [locale, setLocale] = useState<string>(getLocale())

  const messages = useMemo(() => loadLocaleMessages(locale), [locale])

  const refresh: LocalizationContext['refresh'] = useCallback((newLocale: string) => {
    jsCookie.set('LOCALE', newLocale, {
      expires: 365,
      sameSite: 'strict',
    })

    setLocale(newLocale)
  }, [])

  const providerValue: LocalizationContext = useMemo(
    () => ({
      locale,
      refresh,
    }),
    [locale],
  )

  return (
    <Context.Provider value={providerValue}>
      <IntlProvider locale={locale} messages={messages} onError={onIntlProviderError}>
        {children}
      </IntlProvider>
    </Context.Provider>
  )
}
