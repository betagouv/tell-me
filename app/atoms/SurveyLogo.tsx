/* eslint-disable react/prop-types */

import PropTypes from 'prop-types'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 5rem;
  position: relative;
  width: 100%;
`

const Placeholder = styled.div<{
  url?: Common.Nullable<string>
}>`
  background-color: #d5e5a3;
  background-image: url('${p => p.url || ''}');
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
  url?: Common.Nullable<string>
}
const SurveyLogoWithoutRef: ForwardRefRenderFunction<HTMLDivElement, SuveyLogoProps> = (
  { children, className, url, ...props },
  ref,
) => (
  <Container className={className}>
    <Placeholder ref={ref} url={url} {...props} />

    {children}
  </Container>
)

const SurveyLogo = forwardRef(SurveyLogoWithoutRef)

SurveyLogo.displayName = 'SurveyLogo'

SurveyLogo.propTypes = {
  url: PropTypes.string,
}

export default SurveyLogo
