import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Checkbox from '../../atoms/Checkbox'

const StyledCheckbox = styled(Checkbox)`
  align-self: flex-start;
  cursor: pointer;
  justify-self: flex-start;

  .CheckboxIcon {
    background-color: ${p => (p.isChecked ? 'rgb(0, 122, 255)' : 'rgb(255, 255, 255)')};
  }
`

const StyledCheckboxInput = styled.input`
  cursor: pointer;
  height: 0;
  opacity: 0;
  position: absolute;
  width: 0;
`

const Label = styled.div`
  font-size: 16px;
  font-weight: ${p => (p.isChecked ? 700 : 500)};
  line-height: 1.15;
  padding-left: 10px;
`

export default function CheckboxInput({ label, name, value }) {
  const { handleChange, values } = useFormikContext()

  const isChecked = Array.isArray(values[name]) && values[name].includes(value)

  return (
    <StyledCheckbox isChecked={isChecked}>
      <StyledCheckboxInput
        defaultChecked={isChecked}
        name={name}
        onChange={handleChange}
        type="checkbox"
        value={value}
      />

      <Label isChecked={isChecked}>{label}</Label>
    </StyledCheckbox>
  )
}

CheckboxInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}
