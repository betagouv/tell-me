import PropTypes from 'prop-types'
import styled from 'styled-components'

import Choice from '../../atoms/Choice'

const StyledChoice = styled(Choice)`
  align-self: flex-start;
  cursor: pointer;
  justify-self: flex-start;
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
  line-height: 1.15;
  padding-left: 10px;
`

export default function RadioInput({ dangerouslySetInnerHTML, id, index, name, value }) {
  // eslint-disable-next-line no-underscore-dangle
  const label = dangerouslySetInnerHTML.__html

  return (
    <StyledChoice index={index}>
      <StyledRadioInput id={id} name={name} type="radio" value={value} />

      <Label>{label}</Label>
    </StyledChoice>
  )
}

RadioInput.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}
