import { forwardRef } from 'react'
import styled from 'styled-components'

const StyledDiv = styled.p`
  cursor: text;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0.75rem 0;

  :focus:empty::before {
    content: attr(placeholder);
    display: block;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

function Question({ children, ...props }, ref) {
  return (
    <StyledDiv ref={ref} {...props}>
      {children}
    </StyledDiv>
  )
}

const QuestionWithRef = forwardRef(Question)
QuestionWithRef.displayName = 'Question'

export default QuestionWithRef
