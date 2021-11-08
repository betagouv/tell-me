import { styled } from '@singularity-ui/core'
import PropTypes from 'prop-types'
import { useRef } from 'react'

import SurveyLogo from '../../atoms/SurveyLogo'

const StyledSurveyLogo = styled(SurveyLogo)`
  min-height: 5rem;

  > div {
    margin-left: 8rem;
  }
`

const StyledInput = styled.input`
  border: solid 2px ${p => p.theme.color.secondary.background};
  border-radius: 50%;
  color: transparent;
  cursor: pointer;
  height: 6rem;
  left: 5rem;
  opacity: 0.75 !important;
  position: absolute;
  top: -3rem;
  width: 6rem;

  ::-webkit-file-upload-button {
    visibility: hidden;
  }

  :hover {
    border: solid 2px ${p => p.theme.color.secondary.active};
  }
`

export default function Logo({ onChange, surveyId }) {
  const $logo = useRef<HTMLDivElement>(null)

  const updateSelectedFile = event => {
    if ($logo.current === null) {
      return
    }

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
