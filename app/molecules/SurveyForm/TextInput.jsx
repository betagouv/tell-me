import { styled } from '@singularity-ui/core'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'

import Input from '../../atoms/Input'

const StyledInput = styled.input`
  background-color: rgb(255, 255, 255);
  border-radius: 0.25rem;
  border: 0;
  box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px,
    rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
    rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  font-size: 1rem;
  line-height: 1.5;
  min-width: 15rem;
  outline: none;
  padding: 0.25rem 0.75rem calc(0.25rem + 3px);

  ::placeholder {
    color: rgb(187, 187, 187);
  }

  :focus {
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(58 151 212 / 36%) 0px 0px 0px 4px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px;
  }
`

export default function TextInput({ label, name }) {
  const { handleChange, values } = useFormikContext()
  const value = values[name]

  return (
    <Input>
      <StyledInput defaultValue={value} name={name} onChange={handleChange} placeholder={label} type="text" />
    </Input>
  )
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}
