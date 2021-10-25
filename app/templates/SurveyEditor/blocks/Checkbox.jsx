import { styled } from '@singularity-ui/core'
import { forwardRef } from 'react'

import AppfoCheckbox from '../../../atoms/Checkbox'

const StyledCheckbox = styled(AppfoCheckbox)`
  .CheckboxBox {
    cursor: text;
  }

  .CheckboxBox:focus-within .CheckboxIcon {
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px,
      rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  }

  .CheckboxBox:focus-within div {
    font-weight: inherit;
  }
`

const EditableContent = styled.div`
  font-size: 16px;
  line-height: 1.15;
  padding-left: 10px;

  :empty::before {
    min-width: 5rem;
    content: attr(placeholder);
    display: block;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

const Checkbox = forwardRef(({ dangerouslySetInnerHTML, ...props }, ref) => {
  // eslint-disable-next-line no-underscore-dangle
  const { __html: value } = dangerouslySetInnerHTML.__html
  const isEmpty = value?.length === 0

  return (
    <StyledCheckbox>
      <EditableContent ref={ref} dangerouslySetInnerHTML={dangerouslySetInnerHTML} isEmpty={isEmpty} {...props} />
    </StyledCheckbox>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
