import { styled } from '@singularity-ui/core'
import { forwardRef } from 'react'
import { Square } from 'react-feather'

const Label = styled.label`
  /* https://github.com/singularity-ui/core/blob/main/fields/Checkbox.jsx */

  align-items: center;
  border-bottom: solid 1px transparent;
  border-top: solid 1px transparent;
  display: flex;
  font-family: inherit;
  font-size: ${p => p.theme.typography.size.medium * 100}%;
  font-weight: 400;
  padding: ${p => p.theme.padding.layout.tiny} 0;
  user-select: none;
  width: 100%;
  :disabled {
    opacity: 0.65;
  }
  > input {
    cursor: pointer;
    height: 0;
    opacity: 0;
    position: absolute;
    width: 0;
  }
  > svg {
    color: ${p => p.theme.color.secondary.default};
    margin-right: ${p => p.theme.padding.input.medium};
    height: ${p => p.theme.typography.size.medium * 1.5}rem !important;
    transition-delay: 0s, 0s, 0s, 0s;
    transition-duration: 0.15s, 0.15s, 0.15s, 0.15s;
    transition-property: color, background-color, border-color, box-shadow;
    transition-timing-function: ease-in-out, ease-in-out, ease-in-out, ease-in-out;
    width: ${p => p.theme.typography.size.medium * 1.5}rem !important;
  }
  :hover > svg {
    color: ${p => (p.hasError ? p.theme.color.danger.active : p.theme.color.secondary.active)};
  }
`

const Editable = styled.div`
  cursor: text;
  font-weight: 400;

  :empty::before {
    cursor: text;
    min-width: 5rem;
    content: attr(placeholder);
    display: block;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

const Checkbox = forwardRef(({ ...props }, ref) => (
  <Label>
    <Square />

    <Editable ref={ref} {...props} />
  </Label>
))

Checkbox.displayName = 'Checkbox'

export default Checkbox
