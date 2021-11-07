import { styled } from '@singularity-ui/core'
import { forwardRef } from 'react'

const StyledParagraph = styled.p`
  cursor: text;
  font-size: 125%;
  font-weight: 500;
  margin: ${p => p.theme.padding.layout.small} 0;
`

const SurveyQuestion = forwardRef((props, ref) => <StyledParagraph ref={ref} {...props} />)

SurveyQuestion.displayName = 'SurveyQuestion'

export default SurveyQuestion
