import { styled } from '@singularity-ui/core'

import AppfoQuestion from '../../../atoms/Question'

const Question = styled(AppfoQuestion)`
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
