import { forwardRef } from 'react'
import styled from 'styled-components'

const Container = styled.p`
  margin: 0.75rem 0;

  :focus:empty::before {
    content: attr(placeholder);
    display: block;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

function Text({ children, ...props }, ref) {
  return (
    <Container ref={ref} {...props}>
      {children}
    </Container>
  )
}

const TextWithRef = forwardRef(Text)
TextWithRef.displayName = 'Text'

export default TextWithRef
