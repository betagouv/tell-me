import { createGlobalStyle } from 'styled-components'

const Global = createGlobalStyle`
  html {
    display: flex;
    height: 100%;
  }

  body,
  #__next,
  #__tma {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
`

export default Global
