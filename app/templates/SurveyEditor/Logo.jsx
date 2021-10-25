import { styled } from '@singularity-ui/core'
import PropTypes from 'prop-types'
import { useRef } from 'react'

import SurveyLogo from '../../atoms/SurveyLogo'

const StyledSurveyLogo = styled(SurveyLogo)`
  border: solid 2px #d5e5a3;
  display: flex;
  left: 2.5rem;

  :hover {
    background-color: white;
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

export default function Logo({ onChange, surveyId }) {
  const $logo = useRef(null)

  const updateSelectedFile = event => {
    const [image] = event.target.files
    const imageUri = URL.createObjectURL(image)

    $logo.current.style.backgroundImage = `url(${imageUri})`

    const formData = new FormData()
    formData.append('logo', image)
    onChange(formData)
  }

  return (
    <StyledSurveyLogo ref={$logo} surveyId={surveyId}>
      <StyledInput accept="image/png" onChange={updateSelectedFile} type="file" />
    </StyledSurveyLogo>
  )
}

Logo.propTypes = {
  onChange: PropTypes.func.isRequired,
  surveyId: PropTypes.string.isRequired,
}
