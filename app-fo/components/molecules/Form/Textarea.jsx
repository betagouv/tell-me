import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import TextareaField from '../../atoms/Textarea'

const StyledTextarea = styled.textarea`
  background-color: rgb(255, 255, 255);
  border-radius: 0.25rem;
  border: 0;
  box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px,
    rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
    rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  font-family: inherit;
  font-size: 1rem;
  min-height: calc(27px * 3);
  outline: none;
  padding: 0.25rem 0.75rem calc(0.25rem + 3px);
  width: 100%;

  ::placeholder {
    color: rgb(187, 187, 187);
  }

  :focus {
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(58 151 212 / 36%) 0px 0px 0px 4px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px;
  }
`

export default function Textarea({ dangerouslySetInnerHTML, id, name }) {
  const { handleChange } = useFormikContext()

  // eslint-disable-next-line no-underscore-dangle
  const placeholder = dangerouslySetInnerHTML.__html

  return (
    <TextareaField>
      <StyledTextarea id={id} name={name} onChange={handleChange} placeholder={placeholder} type="text" />
    </TextareaField>
  )
}

Textarea.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}
