import { forwardRef } from 'react'
import styled from 'styled-components'

const StyledParagraph = styled.p`
  margin: 0.75rem 0;
`

const Paragraph = forwardRef(({ children, ...props }, ref) => (
  <StyledParagraph ref={ref} {...props}>
    {children}
  </StyledParagraph>
))

Paragraph.displayName = 'Paragraph'

export default Paragraph
