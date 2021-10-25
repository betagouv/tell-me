import { styled } from '@singularity-ui/core'

import AppfoQuestion from '../../../atoms/Question'

const Question = styled(AppfoQuestion)`
  :focus:empty::before {
    content: attr(placeholder);
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

export default Question
