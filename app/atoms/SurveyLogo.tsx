import { forwardRef } from 'react'
import styled from 'styled-components'

import type { ForwardedRef, HTMLAttributes } from 'react'

const Container = styled.div`
  height: 5rem;
  position: relative;
  width: 100%;
`

const Placeholder = styled.div<{
  url: Common.Nullable<string>
}>`
  background-color: #dddddd;
  background-image: url('${p => p.url ?? ''}');
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

type SuveyLogoProps = HTMLAttributes<HTMLDivElement> & {
  url: Common.Nullable<string>
}
function SurveyLogoWithoutRef(
  { children, className, url, ...props }: SuveyLogoProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <Container className={className}>
      <Placeholder ref={ref} url={url} {...props} />

      {children}
    </Container>
  )
}

export const SurveyLogo = forwardRef(SurveyLogoWithoutRef)

SurveyLogo.displayName = 'SurveyLogo'
