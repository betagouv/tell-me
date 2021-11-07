import { styled } from '@singularity-ui/core'

const SurveyHeader = styled.header`
  background-color: #b8d8d8;
  background-image: url('/api/asset/${p => p.surveyId}-header.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 10rem;
  width: 100%;
`

export default SurveyHeader
