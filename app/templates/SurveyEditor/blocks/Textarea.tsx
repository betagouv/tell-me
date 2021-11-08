import { styled } from '@singularity-ui/core'
import { forwardRef } from 'react'

const StyledTextarea = styled.div`
  /* https://github.com/singularity-ui/core/blob/main/fields/Textarea.jsx */

  background-color: ${p => p.theme.color.body.white};
  border: solid 1px ${p => p.theme.color.secondary.default};
  border-radius: ${p => p.theme.appearance.borderRadius.medium};
  font-family: inherit;
  font-size: ${p => p.theme.typography.size.medium * 100}%;
  font-weight: 400;
  height: 5rem;
  padding: ${p => p.theme.padding.input.medium};
  transition-delay: 0s, 0s, 0s, 0s;
  transition-duration: 0.15s, 0.15s, 0.15s, 0.15s;
  transition-property: color, background-color, border-color, box-shadow;
  transition-timing-function: ease-in-out, ease-in-out, ease-in-out, ease-in-out;
  width: 100%;

  :focus {
    box-shadow: 0 0 0 1px ${p => p.theme.color.secondary.active};
  }

  :hover {
    border: solid 1px ${p => p.theme.color.secondary.active};
  }

  :empty::before {
    -webkit-text-fill-color: ${p => p.theme.color.body.light};
    content: attr(placeholder);
    cursor: text;
    display: block;
    opacity: 0.65;
    width: 100%;
  }
`

const Textarea = forwardRef(({ ...props }, ref) => <StyledTextarea ref={ref} as="div" {...props} />)

Textarea.displayName = 'Textarea'

export default Textarea
