import styled from 'styled-components'

import AppfoHeader from '../../../../app-fo/components/atoms/Header'

const StyledHeader = styled(AppfoHeader)`
  cursor: pointer;
  opacity: 0.75 !important;

  :hover {
    opacity: 1 !important;
  }
`

export default function Header({ children }) {
  return <StyledHeader>{children}</StyledHeader>
}
