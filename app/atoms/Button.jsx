import MuiButton from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'

import { THEME_COLORS, THEME_SIZES } from './constants'
import { getDarkColor, getMainColor, getSmallerFontSize, getPadding } from './helpers'

const StyledButton = styled(MuiButton)`
  border: solid 2px ${getMainColor};
  border-radius: 0.25rem;
  font-size: ${getSmallerFontSize};
  font-weight: 700;
  padding: ${getPadding};

  :hover {
    background-color: ${getDarkColor};
    border: solid 2px ${getDarkColor};
    color: white;
  }
`

export default function Button({ children, ...props }) {
  return (
    <StyledButton variant="outlined" {...props}>
      {children}
    </StyledButton>
  )
}

Button.propTypes = {
  color: PropTypes.oneOf(THEME_COLORS).isRequired,
  size: PropTypes.oneOf(THEME_SIZES).isRequired,
}
