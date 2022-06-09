import { NoSsr } from '@app/hocs/NoSsr'
import withApi from '@app/hocs/withApi'
import { WithLocalization } from '@app/hocs/wLocalization'
import { Loader } from '@app/molecules/Loader'
import { AdminBox } from '@app/organisms/AdminBox'
import { SignInDialog } from '@app/organisms/SignInDialog'
import { GlobalStyle, ThemeProvider } from '@singularity/core'
import { AuthProvider } from 'nexauth/client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { createGlobalStyle } from 'styled-components'

import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/700.css'
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

const PRIVATE_PATHS = [/^\/(?!public\/).*/]

export default function TellMeApp({ Component, pageProps }) {
  const router = useRouter()

  const WrappedComponent = withApi(Component)

  if (router.pathname.startsWith('/public/')) {
    return (
      <div id="__tma">
        <Head>
          <title>Tell Me</title>

          <meta content="initial-scale=1, width=device-width" name="viewport" />
        </Head>

        <ThemeProvider>
          <GlobalStyle />
          <GlobalStyleCustom />

          <WithLocalization>
            <WrappedComponent {...pageProps} />
          </WithLocalization>
        </ThemeProvider>
      </div>
    )
  }

  return (
    <NoSsr>
      <div id="__tma">
        <Head>
          <title>Tell Me</title>

          <meta content="initial-scale=1, width=device-width" name="viewport" />
        </Head>

        <ThemeProvider>
          <GlobalStyle />
          <GlobalStyleCustom />

          <WithLocalization>
            <AuthProvider Loader={Loader} privatePaths={PRIVATE_PATHS} SignInDialog={SignInDialog}>
              <AdminBox>
                <WrappedComponent {...pageProps} />
              </AdminBox>
            </AuthProvider>
          </WithLocalization>
        </ThemeProvider>
      </div>
    </NoSsr>
  )
}
