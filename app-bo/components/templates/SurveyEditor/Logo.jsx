import PropTypes from 'prop-types'
import { useRef } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 5rem;
  position: relative;
`

const Placeholder = styled.div`
  background-color: #d5e5a3;
  background-image: url('/survey-assets/${p => p.surveyId}-logo.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border: solid 2px #d5e5a3;
  border-radius: 50%;
  display: flex;
  height: 6rem;
  left: 2.5rem;
  position: absolute;
  top: -3rem;
  width: 6rem;

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
    <Container>
      <Placeholder ref={$logo} surveyId={surveyId}>
        <StyledInput accept="image/png" onChange={updateSelectedFile} type="file" />
      </Placeholder>
    </Container>
  )
}

Logo.propTypes = {
  onChange: PropTypes.func.isRequired,
  surveyId: PropTypes.string.isRequired,
}
