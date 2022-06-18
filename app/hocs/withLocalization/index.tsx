import { getLocale } from '@common/helpers/getLocale'
import { handleError } from '@common/helpers/handleError'
import jsCookie from 'js-cookie'
import { useCallback, useMemo, useState } from 'react'
import { IntlProvider } from 'react-intl'

import enUS from '../../../locales/compiled/en-US.json'
import frFR from '../../../locales/compiled/fr-FR.json'
import { Context } from './Context'
import { LocalizationContext } from './types'

// Prevent this error:
// error TS2786: 'IntlProvider' cannot be used as a JSX component.
//   Its instance type 'IntlProvider' is not a valid JSX element.
//     Types of property 'refs' are incompatible.
// TODO Fix the original 'react-intl' type declaration: https://github.com/formatjs/formatjs.
const RetypedIntlProvider = IntlProvider as any

function loadLocaleMessages(locale: string) {
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
      <RetypedIntlProvider locale={locale} messages={messages} onError={onIntlProviderError}>
        {children}
      </RetypedIntlProvider>
    </Context.Provider>
  )
}
