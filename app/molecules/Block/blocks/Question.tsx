import styled from 'styled-components'

import { SurveyQuestion } from '../../../atoms/SurveyQuestion'

export const Question = styled(SurveyQuestion)`
  margin: 0.5rem 0;

  :focus:empty::before {
    -webkit-text-fill-color: ${p => p.theme.color.body.light};
    content: attr(placeholder);
    display: block;
    opacity: 0.65;
    width: 100%;
  }
`
