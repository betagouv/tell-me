import { NoSsr } from '@app/hocs/NoSsr'
import { withApi } from '@app/hocs/withApi'
import { WithLocalization } from '@app/hocs/withLocalization'
import { Loader } from '@app/molecules/Loader'
import { SignInDialog } from '@app/organisms/SignInDialog'
import { store } from '@app/store'
import { GlobalStyle, theme } from '@singularity/core'
import { AuthProvider } from 'nexauth/client'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

import type { AppProps } from 'next/app'

import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/700.css'
import 'react-toastify/dist/ReactToastify.css'

const GlobalStyleCustom = createGlobalStyle`
  html, body {
    height: 100%;
  }

  body,
  #__next {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 0;
    min-width: 0;
 }

`

const PRIVATE_PATHS = [/^\/(?!public|test\/).*/]

export default function TellMeApp({ Component, pageProps }: AppProps) {
  const WrappedComponent = withApi(Component)

  return (
    <NoSsr>
      <Head>
        <title>Tell Me</title>

        <meta content="initial-scale=1, width=device-width" name="viewport" />

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </Head>

      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <GlobalStyleCustom />

        <WithLocalization>
          <AuthProvider Loader={Loader} privatePaths={PRIVATE_PATHS} SignInDialog={SignInDialog}>
            <Provider store={store}>
              <WrappedComponent {...pageProps} />
            </Provider>
          </AuthProvider>
        </WithLocalization>
      </ThemeProvider>
    </NoSsr>
  )
}
