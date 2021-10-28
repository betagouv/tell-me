import { useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'

import enUS from '../../../locales/compiled/en-US.json'
import frFR from '../../../locales/compiled/fr-FR.json'
import getLocale from '../../helpers/getLocale'
import handleError from '../../helpers/handleError'
import Context from './Context'

export function loadLocaleMessages(locale) {
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

const withLocalization = Component => {
  // We must name our wrapped component or it will appear as `Unknown` in case a bug happened within it
  const WithLocalization = pageProps => {
    const [locale, setLocale] = useState('en-US')

    const messages = loadLocaleMessages(locale)

    useEffect(() => {
      setLocale(getLocale())
    }, [])

    const refresh = newLocale => {
      window.localStorage.setItem('locale', newLocale)

      setLocale(getLocale())
    }

    const providerValue = {
      locale,
      refresh,
    }

    return (
      <IntlProvider locale={locale} messages={messages} onError={onIntlProviderError}>
        <Context.Provider value={providerValue}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </Context.Provider>
      </IntlProvider>
    )
  }

  return WithLocalization
}

export default withLocalization
