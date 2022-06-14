import styled from 'styled-components'

import { SurveyParagraph } from '../../../atoms/SurveyParagraph'

export const Paragraph = styled(SurveyParagraph)`
  :focus:empty::before {
    content: attr(placeholder);
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`
