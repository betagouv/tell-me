import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  padding: 0 5rem;

  :hover {
    background-color: #ffffff;
    cursor: text;
  }
`

export default function Row({ children, onClick }) {
  return <Container onClick={onClick}>{children}</Container>
}

Row.propTypes = {
  onClick: PropTypes.func.isRequired,
}
