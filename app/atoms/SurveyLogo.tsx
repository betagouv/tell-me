/* eslint-disable react/prop-types */

import PropTypes from 'prop-types'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 5rem;
  position: relative;
  width: 100%;
`

const Placeholder = styled.div<any>`
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

type SuveyLogoProps = {
  className?: string
  surveyId: string
}
const SurveyLogoWithoutRef: ForwardRefRenderFunction<HTMLDivElement, SuveyLogoProps> = (
  { children, className, surveyId, ...props },
  ref,
) => (
  <Container className={className}>
    <Placeholder ref={ref} surveyId={surveyId} {...props} />

    {children}
  </Container>
)

const SurveyLogo = forwardRef(SurveyLogoWithoutRef)

SurveyLogo.displayName = 'SurveyLogo'

SurveyLogo.propTypes = {
  surveyId: PropTypes.string.isRequired,
}

export default SurveyLogo
