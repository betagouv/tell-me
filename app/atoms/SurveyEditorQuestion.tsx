import styled from 'styled-components'

import { SurveyQuestion } from './SurveyQuestion'

export const SurveyEditorQuestion = styled(SurveyQuestion)`
  margin: 0.5rem 0;

  :focus:empty::before {
    -webkit-text-fill-color: ${p => p.theme.color.body.light};
    content: attr(placeholder);
    display: block;
    opacity: 0.65;
    width: 100%;
  }
`

SurveyEditorQuestion.displayName = 'SurveyEditorQuestion'
