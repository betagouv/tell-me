import { styled } from '@singularity-ui/core'
import { forwardRef } from 'react'

const StyledHeader = styled.header`
  background-color: #b8d8d8;
  background-image: url('/api/asset/${p => p.surveyId}-header.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 10rem;
  width: 100%;
`

const SurveyHeader = forwardRef((props, ref) => <StyledHeader ref={ref} {...props} />)

SurveyHeader.displayName = 'SurveyHeader'

export default SurveyHeader
