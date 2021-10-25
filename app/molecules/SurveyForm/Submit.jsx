import { Button, styled } from '@singularity-ui/core'
import { useFormikContext } from 'formik'

const Container = styled.div`
  margin-top: 1.5rem;
`

export default function Submit({ children }) {
  const { isSubmitting } = useFormikContext()

  return (
    <Container>
      <Button disabled={isSubmitting} type="submit" variant="contained">
        {children}
      </Button>
    </Container>
  )
}
