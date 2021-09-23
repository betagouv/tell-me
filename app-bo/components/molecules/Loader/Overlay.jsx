import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

const StyledOverlay = styled(Box)`
  align-items: center;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  padding: 2rem;
`

export default function Overlay({ children }) {
  return <StyledOverlay>{children}</StyledOverlay>
}
