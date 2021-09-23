import MuiInputAdornment from '@mui/material/InputAdornment'
import MuiOutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'

import { THEME_COLORS, THEME_SIZES } from './constants'
import { getDarkColor, getMainColor, getPadding, getFontSize, getSmallerFontSize } from './helpers'

const OutlinedInput = styled(MuiOutlinedInput)`
  padding-right: 0.25rem;

  .MuiOutlinedInput-notchedOutline {
    border: solid 2px ${getMainColor};
    border-radius: 0.25rem;
    padding: 0;
  }
  &:hover,
  &.Mui-focused {
    .MuiOutlinedInput-notchedOutline {
      border: solid 2px ${getDarkColor};
    }
  }

  .MuiOutlinedInput-input {
    font-size: ${getFontSize};
    font-weight: 500;
    height: auto;
    line-height: 1.75;
    padding: ${getPadding};
  }
`

const InputAdornment = styled(MuiInputAdornment)`
  /* border: solid 2px ${getDarkColor}; */
  font-size: ${getSmallerFontSize};
  height: auto;

  .MuiSvgIcon-root {
    height: 1.5rem;
    width: 1.5rem;
  }
`

export default function IconInput({ children, color, size, ...props }) {
  return (
    <OutlinedInput
      color={color}
      endAdornment={
        <InputAdornment color={color} position="end" size={size}>
          {children}
        </InputAdornment>
      }
      size={size}
      {...props}
    />
  )
}

IconInput.propTypes = {
  color: PropTypes.oneOf(THEME_COLORS).isRequired,
  size: PropTypes.oneOf(THEME_SIZES).isRequired,
}
