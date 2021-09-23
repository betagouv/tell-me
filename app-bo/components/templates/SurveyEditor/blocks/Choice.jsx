import PropsTypes from 'prop-types'
import { forwardRef } from 'react'
import styled from 'styled-components'

const getIndexLetter = index => (index + 10).toString(36).toUpperCase()

const Container = styled.div`
  background-color: rgb(255, 255, 255);
  box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px,
    rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
    rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  border-radius: 5px;
  cursor: text;
  display: inline-flex;
  flex-direction: column;
  margin: 0.375rem 0;
  min-height: 1rem;
  outline: none;
  padding: 0.5rem 0.625rem;
  position: relative;
`

const InnerContainer = styled.div`
  display: flex;
  flex: 1 1 0%;
  width: 100%;
`

const Letter = styled.div`
  align-items: center;
  background-color: rgb(102, 102, 102);
  border-radius: 3px;
  color: rgb(255, 255, 255);
  display: flex;
  font-size: 12px;
  font-weight: 900;
  height: 18px;
  justify-content: center;
  line-height: 1;
  min-height: 18px;
  min-width: 18px;
  width: 18px;
`

const Input = styled.div`
  font-size: 16px;
  line-height: 1.15;
  padding-left: 10px;
  min-width: 5rem;

  :focus:empty::before {
    content: attr(placeholder);
    display: block;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

const Choice = forwardRef(({ children, index, ...props }, ref) => {
  const letter = getIndexLetter(index)

  return (
    <Container>
      <InnerContainer>
        <Letter>{letter}</Letter>

        <Input ref={ref} {...props}>
          {children}
        </Input>
      </InnerContainer>
    </Container>
  )
})

Choice.displayName = 'Choice'

Choice.propTypes = {
  index: PropsTypes.number.isRequired,
}

export default Choice
