import { forwardRef } from 'react'
import styled from 'styled-components'

const StyledHeading1 = styled.h1`
  margin-bottom: 0.75rem;
  margin-top: 0;

  :focus:empty::before {
    content: attr(placeholder);
    display: block;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

function Title({ children, ...props }, ref) {
  return (
    <StyledHeading1 ref={ref} {...props}>
      {children}
    </StyledHeading1>
  )
}

const TitleWithRef = forwardRef(Title)
TitleWithRef.displayName = 'Title'

export default TitleWithRef
