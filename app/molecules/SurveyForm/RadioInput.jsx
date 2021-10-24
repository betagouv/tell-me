import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Choice from '../../atoms/Choice'

const StyledChoice = styled(Choice)`
  align-self: flex-start;
  cursor: pointer;
  justify-self: flex-start;

  .ChoiceBoxLetter {
    background-color: ${p => (p.isChecked ? 'rgb(0, 122, 255)' : 'rgb(102, 102, 102)')};
  }
`

const StyledRadioInput = styled.input`
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

export default function RadioInput({ countLetter, label, name, value }) {
  const { handleChange, values } = useFormikContext()

  const isChecked = value === values[name]

  return (
    <StyledChoice countLetter={countLetter} isChecked={isChecked}>
      <StyledRadioInput defaultChecked={isChecked} name={name} onChange={handleChange} type="radio" value={value} />

      <Label isChecked={isChecked}>{label}</Label>
    </StyledChoice>
  )
}

RadioInput.propTypes = {
  countLetter: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}
