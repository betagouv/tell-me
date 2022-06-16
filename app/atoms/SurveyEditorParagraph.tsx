import styled from 'styled-components'

import { SurveyParagraph } from './SurveyParagraph'

export const SurveyEditorParagraph = styled(SurveyParagraph)`
  :focus:empty::before {
    content: attr(placeholder);
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

SurveyEditorParagraph.displayName = 'SurveyEditorParagraph'
