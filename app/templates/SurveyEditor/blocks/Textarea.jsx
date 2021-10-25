import { styled } from '@singularity-ui/core'
import { forwardRef } from 'react'

import AppfoTextarea from '../../../atoms/Textarea'

const StyledTextarea = styled(AppfoTextarea)`
  cursor: text;
`

const Box = styled.div`
  align-items: flex-start;
  background-color: rgb(255, 255, 255);
  border-radius: 0.25rem;
  box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px,
    rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
    rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  display: inline-flex;
  min-height: calc(27px * 3);
  min-width: 100%;
  padding: 0.25rem 0.75rem calc(0.25rem + 3px);
  position: relative;
`

const EditableContent = styled.div`
  color: rgb(187, 187, 187);
  flex-grow: 1;
  white-space: pre-wrap;
  word-break: break-word;

  :empty::before {
    width: 100%;
    content: attr(placeholder);
    display: block;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

const Checkbox = forwardRef(({ ...props }, ref) => (
  <StyledTextarea>
    <Box>
      <EditableContent ref={ref} {...props} />
    </Box>
  </StyledTextarea>
))

Checkbox.displayName = 'Checkbox'

export default Checkbox
