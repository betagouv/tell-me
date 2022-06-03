import BetterPropTypes from 'better-prop-types'
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

type HeaderProps = {
  onChange: (formData: FormData) => void | Promise<void>
  url: string | null
}
export default function Header({ onChange, url }: HeaderProps) {
  const $header = useRef<HTMLDivElement>(null)

  const updateSelectedFile = event => {
    if ($header.current === null) {
      return
    }

    const [image] = event.target.files
    const imageUri = URL.createObjectURL(image)

    $header.current.style.backgroundImage = `url(${imageUri})`

    const formData = new FormData()
    formData.append('cover', image)
    onChange(formData)
  }

  return (
    <StyledSurveyHeader ref={$header} url={url}>
      <StyledInput accept="image/png" onChange={updateSelectedFile} type="file" />
    </StyledSurveyHeader>
  )
}

Header.propTypes = {
  onChange: BetterPropTypes.func.isRequired,
  url: BetterPropTypes.string,
}
