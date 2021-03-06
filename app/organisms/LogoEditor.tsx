import { useRef } from 'react'
import styled from 'styled-components'

import { SurveyLogo } from '../atoms/SurveyLogo'

const StyledSurveyLogo = styled<any>(SurveyLogo)`
  min-height: 5rem;

  > div {
    margin-left: 9.5rem;
  }
`

const StyledInput = styled.input<any>`
  border: solid 2px ${p => p.theme.color.secondary.background};
  border-radius: 50%;
  color: transparent;
  cursor: pointer;
  height: 6rem;
  left: 6.5rem;
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

type LogoEditorProps = {
  onChange: (formData: FormData) => void | Promise<void>
  url: string | null
}
export function LogoEditor({ onChange, url }: LogoEditorProps) {
  const $logo = useRef<HTMLDivElement>(null)

  const updateSelectedFile = event => {
    if ($logo.current === null) {
      return
    }

    const [image] = event.target.files
    const imageUri = URL.createObjectURL(image)

    $logo.current.style.backgroundImage = `url(${imageUri})`

    const formData = new FormData()
    formData.append('file', image)
    onChange(formData)
  }

  return (
    <StyledSurveyLogo ref={$logo} url={url}>
      <StyledInput accept="image/png" onChange={updateSelectedFile} type="file" />
    </StyledSurveyLogo>
  )
}
