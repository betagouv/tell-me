import { Button } from '@singularity/core'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

const Container = styled.div`
  padding: ${p => p.theme.padding.layout.large} 0;
`

export function Submit({ children }) {
  const { isSubmitting } = useFormikContext<any>()

  return (
    <Container>
      <Button disabled={isSubmitting} type="submit">
        {children}
      </Button>
    </Container>
  )
}
