import { styled } from '@singularity-ui/core'
import { forwardRef } from 'react'

const StyledHeading1 = styled.h1`
  font-size: 150%;
  font-weight: 600;
`

const SurveyTitle = forwardRef((props, ref) => <StyledHeading1 ref={ref} {...props} />)

SurveyTitle.displayName = 'SurveyTitle'

export default SurveyTitle
