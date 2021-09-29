import { forwardRef } from 'react'
import styled from 'styled-components'

import AppfoInput from '../../../../../app-fo/components/atoms/Input'

const StyledInput = styled(AppfoInput)`
  cursor: text;
`

const Box = styled.div`
  position: relative;
  min-width: 320px;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  height: 36px;
  padding: 0px 10px;
  box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px,
    rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
    rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  border: 0px;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
`

const Input = styled.div`
  width: 100%;
  color: rgb(187, 187, 187);
`

const Checkbox = forwardRef(({ ...props }, ref) => (
  <StyledInput>
    <Box>
      <Input ref={ref} {...props} />
    </Box>
  </StyledInput>
))

Checkbox.displayName = 'Checkbox'

export default Checkbox
