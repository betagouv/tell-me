import PropTypes from 'prop-types'
import { useRef } from 'react'
import styled from 'styled-components'

import SurveyHeader from '../../atoms/SurveyHeader'

const StyledSurveyHeader = styled<any>(SurveyHeader)`
  display: flex;
  min-height: 10rem;
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
  const $header = useRef<HTMLDivElement>(null)

  const updateSelectedFile = event => {
    if ($header.current === null) {
      return
    }

    const [image] = event.target.files
    const imageUri = URL.createObjectURL(image)

    $header.current.style.backgroundImage = `url(${imageUri})`

    const formData = new FormData()
    formData.append('header', image)
    onChange(formData)
  }

  return (
    <StyledSurveyHeader ref={$header} surveyId={surveyId}>
      <StyledInput accept="image/png" onChange={updateSelectedFile} type="file" />
    </StyledSurveyHeader>
  )
}

Header.propTypes = {
  onChange: PropTypes.func.isRequired,
  surveyId: PropTypes.string.isRequired,
}
