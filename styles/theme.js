/* eslint-disable sort-keys-fix/sort-keys-fix */

/**
 * @see https://mui.com/customization/default-theme/
 */

export const LIGHT_THEME = {
  palette: {
    mode: 'light',
    primary: {
      main: '#7A9E9F',
      dark: '#5e8283',
    },
    secondary: {
      main: '#66615B',
      dark: '#484541',
    },
    error: {
      main: '#EB5E28',
      dark: '#c84513',
    },
    warning: {
      main: '#F3BB45',
      dark: '#f0a810',
    },
    info: {
      main: '#68B3C8',
      dark: '#429cb6',
    },
    success: {
      main: '#7AC29A',
      dark: '#54b07d',
    },
    background: {
      default: '#f4f3ef',
      window: '#ffffff',
      menu: '#66615b',
    },
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: `'Mulish', sans-serif`,
    fontSize: 16,
  },
}

export const DARK_THEME = {
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgb(104, 142, 255)',
      dark: 'rgb(72, 99, 178)',
    },
    text: {
      primary: '#ffffff',
    },
    background: {
      default: '#171c24',
      window: '#222b36',
    },
  },
  typography: {
    fontFamily: `'Mulish', sans-serif`,
    fontSize: 16,
  },
}
