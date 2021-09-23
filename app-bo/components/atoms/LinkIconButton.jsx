import MuiIconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const IconButton = styled(MuiIconButton)`
  /* border: solid 2px ${({ theme }) => theme.palette.primary.main};
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.5rem 1.125rem 0.5rem 1rem;

  :hover {
    background-color: ${({ theme }) => theme.palette.primary.main};
    border: solid 2px ${({ theme }) => theme.palette.primary.main};
    color: white;
  } */
`

export default function LinkIconButton({ children, to }) {
  return (
    <IconButton component={Link} to={to} variant="outlined">
      {children}
    </IconButton>
  )
}

LinkIconButton.propTypes = {
  to: PropTypes.string.isRequired,
}
