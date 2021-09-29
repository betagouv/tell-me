import PropsTypes from 'prop-types'
import { forwardRef } from 'react'
import styled from 'styled-components'

import AppfoChoice from '../../../../../app-fo/components/atoms/Choice'

const StyledChoice = styled(AppfoChoice)`
  .ChoiceBox {
    cursor: text;
  }

  .ChoiceBox:focus-within {
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px,
      rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  }

  .ChoiceBox:focus-within .ChoiceBoxLetter {
    background-color: rgb(102, 102, 102);
  }

  .ChoiceBox:focus-within > div {
    font-weight: inherit;
  }
`

const Input = styled.div`
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

const Choice = forwardRef(({ index, ...props }, ref) => (
  <StyledChoice index={index}>
    <Input ref={ref} {...props} />
  </StyledChoice>
))

Choice.displayName = 'Choice'

Choice.propTypes = {
  index: PropsTypes.number.isRequired,
}

export default Choice
