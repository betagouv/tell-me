import { styled } from '@singularity-ui/core'
import { forwardRef } from 'react'

const StyledParagraph = styled.p`
  cursor: text;
  font-size: 125%;
  font-weight: 500;
  margin: 1rem 0 0.5rem;
`

const Question = forwardRef((props, ref) => <StyledParagraph ref={ref} {...props} />)

Question.displayName = 'Question'

export default Question
