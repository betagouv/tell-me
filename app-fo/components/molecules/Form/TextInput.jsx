import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Input from '../../atoms/Input'

const StyledInput = styled.input`
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  border: 0px;
  box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px,
    rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
    rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  font-size: 1rem;
  height: 36px;
  outline: none;
  padding: 0px 10px;

  ::placeholder {
    color: rgb(187, 187, 187);
  }

  :focus {
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(58 151 212 / 36%) 0px 0px 0px 4px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px;
  }
`

export default function CheckboxInput({ dangerouslySetInnerHTML, id, name }) {
  const { handleChange, values } = useFormikContext()

  const isChecked = Array.isArray(values[name]) && values[name].includes(id)
  // eslint-disable-next-line no-underscore-dangle
  const placeholder = dangerouslySetInnerHTML.__html

  return (
    <Input isChecked={isChecked}>
      <StyledInput id={id} name={name} onChange={handleChange} placeholder={placeholder} type="text" />
    </Input>
  )
}

CheckboxInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}
