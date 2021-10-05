import { forwardRef } from 'react'
import styled from 'styled-components'

const StyledHeader = styled.header`
  background-color: #b8d8d8;
  height: 10rem;
  opacity: 1;
  width: 100%;
`

const Header = forwardRef((props, ref) => <StyledHeader ref={ref} {...props} />)

Header.displayName = 'Header'

export default Header
