import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const Container = styled.div`
  padding: 0 5rem;

  ${props =>
    !props.isFixed &&
    css`
      :hover {
        background-color: #ffffff;
        cursor: text;
      }
    `}
`

export default function Row({ children, isFixed }) {
  return <Container isFixed={isFixed}>{children}</Container>
}

Row.defaultProps = {
  isFixed: false,
}

Row.propTypes = {
  isFixed: PropTypes.bool,
}
