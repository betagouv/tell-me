import { createGlobalStyle, GlobalStyle, ThemeProvider } from '@singularity-ui/core'
import Head from 'next/head'
import { useRouter } from 'next/router'

import withApi from '../app/hocs/withApi'
import withAuth from '../app/hocs/withAuth'
import withLocalization from '../app/hocs/withLocalization'

import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'

const GlobalStyleCustom = createGlobalStyle`
  html {
    display: flex;
    height: 100%;
  }

  body {
    color: ${p => p.theme.color.body.main};
    line-height: 1.5;
  }

  body,
  #__next,
  #__tma {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
`

export default function TellMeApp({ Component, pageProps }) {
  const { pathname } = useRouter()

  const WrappedComponent = withAuth(withApi(withLocalization(Component)))

  if (!pathname.startsWith('/survey/') && !process.browser) {
    return <div id="__tma" suppressHydrationWarning />
  }

  // console.log(theme)

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
