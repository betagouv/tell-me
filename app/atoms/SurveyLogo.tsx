import { styled } from '@singularity-ui/core'
import { forwardRef, ForwardRefRenderFunction, ReactChildren } from 'react'

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

type SuveyLogoProps = {
  children: ReactChildren
  className: string
}
const SurveyLogoWithoutRef: ForwardRefRenderFunction<HTMLDivElement, SuveyLogoProps> = (
  { children, className, ...props },
  ref,
) => (
  <Container className={className}>
    <Placeholder ref={ref} {...props} />
    {children}
  </Container>
)

const SurveyLogo = forwardRef(SurveyLogoWithoutRef)

SurveyLogo.displayName = 'SurveyLogo'

export default SurveyLogo
