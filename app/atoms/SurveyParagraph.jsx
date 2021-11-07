import { styled } from '@singularity-ui/core'
import { forwardRef } from 'react'

const StyledParagraph = styled.p`
  margin: 0.75rem 0;
`

const SurveyParagraph = forwardRef((props, ref) => <StyledParagraph ref={ref} {...props} />)

SurveyParagraph.displayName = 'SurveyParagraph'

export default SurveyParagraph
