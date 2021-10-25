import { styled } from '@singularity-ui/core'

import AppfoTitle from '../../../atoms/Title'

const Title = styled(AppfoTitle)`
  :empty::before {
    content: 'Your Survey Title';
    cursor: text;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

export default Title
