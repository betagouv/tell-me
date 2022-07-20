import { Button } from '@singularity/core'
import { useFormikContext } from 'formik'

export function Submit({ children }) {
  const { isSubmitting } = useFormikContext<any>()

  return (
    <Button disabled={isSubmitting} type="submit">
      {children}
    </Button>
  )
}
