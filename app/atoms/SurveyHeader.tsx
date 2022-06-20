import styled from 'styled-components'

export const SurveyHeader = styled.header<{
  url: string | null
}>`
  background-color: #b8d8d8;
  background-image: url('${p => p.url ?? ''}');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 10rem;
  width: 100%;
`

SurveyHeader.displayName = 'SurveyHeader'
