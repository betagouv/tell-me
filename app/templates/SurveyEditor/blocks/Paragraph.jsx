import { styled } from '@singularity-ui/core'

import AppfoParagraph from '../../../atoms/Paragraph'

const Paragraph = styled(AppfoParagraph)`
  :focus:empty::before {
    content: attr(placeholder);
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

export default Paragraph
