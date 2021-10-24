import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import withApi from '../app/hocs/withApi'
import withAuth from '../app/hocs/withAuth'
import Global from '../styles/Global'
import { DARK_THEME, LIGHT_THEME } from '../styles/theme'

import '@fontsource/mulish/300.css'
import '@fontsource/mulish/400.css'
import '@fontsource/mulish/500.css'
import '@fontsource/mulish/600.css'
import '@fontsource/mulish/700.css'

export default function TellMeApp({ Component, pageProps }) {
  const [themeMode] = useState('light')
  const { pathname } = useRouter()

  const selectedTheme = useMemo(() => {
    const theme = themeMode === 'light' ? LIGHT_THEME : DARK_THEME

    return createTheme(theme)
  }, [themeMode])

  if (!pathname.startsWith('/survey/') && !process.browser) {
    return <div id="__tma" suppressHydrationWarning />
  }

  const WrappedComponent = withAuth(withApi(Component))

  return (
    <div id="__tma" suppressHydrationWarning>
      <Head>
        <title>Tell Me</title>

        <meta content="initial-scale=1, width=device-width" name="viewport" />
        <meta content={selectedTheme.palette.primary.main} name="theme-color" />

        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
      </Head>

      <ThemeProvider theme={selectedTheme}>
        <CssBaseline />
        <Global />

        <WrappedComponent {...pageProps} />
      </ThemeProvider>
    </div>
  )
}
