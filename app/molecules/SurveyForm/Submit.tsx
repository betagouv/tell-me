import { Button, styled } from '@singularity-ui/core'
import { useFormikContext } from 'formik'

const Container = styled.div`
  padding: 3rem 0;
`

export default function Submit({ children }) {
  const { isSubmitting } = useFormikContext<any>()

  return (
    <Container>
      <Button disabled={isSubmitting} type="submit" variant="contained">
        {children}
      </Button>
    </Container>
  )
}
