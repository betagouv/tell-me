import { styled } from '@singularity-ui/core'

import SurveyQuestion from '../../../atoms/SurveyQuestion.tsx'

const Question = styled(SurveyQuestion)`
  margin: 0.5rem 0;

  :focus:empty::before {
    -webkit-text-fill-color: ${p => p.theme.color.body.light};
    content: attr(placeholder);
    display: block;
    opacity: 0.65;
    width: 100%;
  }
`

export default Question
