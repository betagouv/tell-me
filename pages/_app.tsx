import { GlobalStyle, ThemeProvider } from '@singularity-ui/core'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { createGlobalStyle } from 'styled-components'

import withApi from '../app/hocs/withApi'
import withAuth from '../app/hocs/withAuth'
import withLocalization from '../app/hocs/withLocalization'

import 'react-toastify/dist/ReactToastify.css'

const GlobalStyleCustom = createGlobalStyle<{
  theme: {
    color: any
  }
}>`
  html, body {
    height: 100%;
  }

  body,
  #__next,
  #__tma {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 0;
    min-width: 0;
 }
`

export default function TellMeApp({ Component, pageProps }) {
  const { pathname } = useRouter()

  const WrappedComponent = withAuth(withApi(withLocalization(Component)))

  if (!pathname.startsWith('/survey/') && !process.browser) {
    return <div id="__tma" suppressHydrationWarning />
  }

  return (
    <div id="__tma" suppressHydrationWarning>
      <Head>
        <title>Tell Me</title>

        <meta content="initial-scale=1, width=device-width" name="viewport" />
      </Head>

      <ThemeProvider>
        <GlobalStyle />
        <GlobalStyleCustom />

        <WrappedComponent {...pageProps} />
      </ThemeProvider>
    </div>
  )
}
