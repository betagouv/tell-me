import { styled } from '@singularity-ui/core'
import { forwardRef } from 'react'

const StyledHeading1 = styled.h1`
  font-size: 150%;
  font-weight: 400;
`

const Title = forwardRef((props, ref) => <StyledHeading1 ref={ref} {...props} />)

Title.displayName = 'Title'

export default Title
