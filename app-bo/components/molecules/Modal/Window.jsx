import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

const StyledWindow = styled(Box)`
  background-color: ${({ theme }) => theme.palette.background.window};
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadows[1]};
  padding: 2rem;
  width: 100%;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    width: 75%;
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    width: 67%;
  }

  ${({ theme }) => theme.breakpoints.up('lg')} {
    width: 36rem;
  }
`

export default StyledWindow
