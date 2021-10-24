import { styled } from '@mui/material/styles'
import MuiTypography from '@mui/material/Typography'

const StyledTitle = styled(MuiTypography)`
  font-size: 28px;
  margin-bottom: 2rem;
`

export default function Title({ children }) {
  return <StyledTitle component="h4">{children}</StyledTitle>
}
