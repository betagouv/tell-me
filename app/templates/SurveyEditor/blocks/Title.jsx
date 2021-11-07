import { styled } from '@singularity-ui/core'

import SurveyTitle from '../../../atoms/SurveyTitle.tsx'

const Title = styled(SurveyTitle)`
  :empty::before {
    content: 'Your Survey Title';
    cursor: text;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

export default Title
