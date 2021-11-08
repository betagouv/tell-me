import { styled } from '@singularity-ui/core'

import SurveyParagraph from '../../../atoms/SurveyParagraph'

const Paragraph = styled(SurveyParagraph)`
  :focus:empty::before {
    content: attr(placeholder);
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

export default Paragraph
