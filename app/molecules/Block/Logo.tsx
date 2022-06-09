import BetterPropTypes from 'better-prop-types'
import { useRef } from 'react'
import styled from 'styled-components'

import SurveyLogo from '../../atoms/SurveyLogo'

const StyledSurveyLogo = styled<any>(SurveyLogo)`
  min-height: 5rem;

  > div {
    margin-left: 8rem;
  }
`

const StyledInput = styled.input<any>`
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

type LogoProps = {
  onChange: (formData: FormData) => void | Promise<void>
  url: string | null
}
export function Logo({ onChange, url }: LogoProps) {
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
    <StyledSurveyLogo ref={$logo} url={url}>
      <StyledInput accept="image/png" onChange={updateSelectedFile} type="file" />
    </StyledSurveyLogo>
  )
}

Logo.propTypes = {
  onChange: BetterPropTypes.func.isRequired,
  url: BetterPropTypes.string,
}
