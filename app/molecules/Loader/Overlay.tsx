import styled from 'styled-components'

const StyledOverlay = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  padding: 2rem;
`

export function Overlay({ children }) {
  return <StyledOverlay>{children}</StyledOverlay>
}
