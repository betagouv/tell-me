import { styled } from '@singularity-ui/core'
import { forwardRef } from 'react'

const Container = styled.div`
  height: 5rem;
  position: relative;
  width: 100%;
`

const Placeholder = styled.div`
  background-color: #d5e5a3;
  background-image: url('/api/asset/${p => p.surveyId}-logo.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  height: 6rem;
  left: -3rem;
  position: absolute;
  top: -3rem;
  width: 6rem;
`

const SurveyLogo = forwardRef((props, ref) => (
  <Container>
    <Placeholder ref={ref} {...props} />
  </Container>
))

SurveyLogo.displayName = 'SurveyLogo'

export default SurveyLogo
