import PropsTypes from 'prop-types'
import styled from 'styled-components'

const getIndexLetter = index => (index + 10).toString(36).toUpperCase()

export const Container = styled.div`
  display: flex;
  margin: 0.375rem 0;
  min-height: 1rem;
  position: relative;
`

export const Box = styled.label`
  background-color: rgb(255, 255, 255);
  box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px,
    rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
    rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  padding: 0.5rem 0.625rem;

  :focus-within {
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(58 151 212 / 36%) 0px 0px 0px 4px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 122 255) 0px 0px 0px 2px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px !important;
  }

  :focus-within > span {
    background-color: rgb(0, 122, 255);
  }

  :focus-within > div {
    font-weight: 700;
  }
`

export const Letter = styled.span`
  align-items: center;
  background-color: rgb(102, 102, 102);
  border-radius: 3px;
  color: rgb(255, 255, 255);
  display: flex;
  font-size: 12px;
  font-weight: 900;
  height: 1.125rem;
  justify-content: center;
  line-height: 1;
  width: 1.125rem;
`

export default function Choice({ children, index }) {
  const letter = getIndexLetter(index)

  return (
    <Container>
      <Box>
        <Letter>{letter}</Letter>

        {children}
      </Box>
    </Container>
  )
}

Choice.propTypes = {
  index: PropsTypes.number.isRequired,
}
