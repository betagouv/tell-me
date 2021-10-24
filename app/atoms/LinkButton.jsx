import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Button from './Button'

export default function LinkButton({ children, to, ...props }) {
  return (
    <Button component={Link} to={to} {...props}>
      {children}
    </Button>
  )
}

LinkButton.propTypes = {
  ...Button.propTypes,
  to: PropTypes.string.isRequired,
}
