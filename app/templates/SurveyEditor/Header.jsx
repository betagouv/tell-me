import PropTypes from 'prop-types'
import { useRef } from 'react'
import styled from 'styled-components'

import AppfoHeader from '../../atoms/Header'

const StyledHeader = styled(AppfoHeader)`
  background-image: url('/api/asset/${p => p.surveyId}-header.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  opacity: 0.75 !important;

  :hover {
    opacity: 1 !important;
  }
`

const StyledInput = styled.input`
  color: transparent;
  cursor: pointer;
  flex-grow: 1;

  ::-webkit-file-upload-button {
    visibility: hidden;
  }
`

export default function Header({ onChange, surveyId }) {
  const $header = useRef(null)

  const updateSelectedFile = event => {
    const [image] = event.target.files
    const imageUri = URL.createObjectURL(image)

    $header.current.style.backgroundImage = `url(${imageUri})`

    const formData = new FormData()
    formData.append('header', image)
    onChange(formData)
  }

  return (
    <StyledHeader ref={$header} surveyId={surveyId}>
      <StyledInput accept="image/png" onChange={updateSelectedFile} type="file" />
    </StyledHeader>
  )
}

Header.propTypes = {
  onChange: PropTypes.func.isRequired,
  surveyId: PropTypes.string.isRequired,
}
