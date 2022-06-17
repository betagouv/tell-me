import styled from 'styled-components'

import { SurveyTitle } from './SurveyTitle'

export const SurveyEditorTitle = styled(SurveyTitle)`
  :empty::before {
    content: 'Your Survey Title';
    cursor: text;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

SurveyEditorTitle.displayName = 'SurveyEditorTitle'
