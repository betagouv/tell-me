import { forwardRef } from 'react'
import styled from 'styled-components'

const StyledDiv = styled.p`
  cursor: text;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.75rem 0;
`

const Question = forwardRef((props, ref) => <StyledDiv ref={ref} {...props} />)

Question.displayName = 'Question'

export default Question
