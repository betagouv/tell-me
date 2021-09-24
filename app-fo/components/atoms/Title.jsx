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

const Title = forwardRef(({ children, ...props }, ref) => (
  <StyledHeading1 ref={ref} {...props}>
    {children}
  </StyledHeading1>
))

Title.displayName = 'Title'

export default Title
