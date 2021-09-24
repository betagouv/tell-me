import MuiButton from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { useFormikContext } from 'formik'

const StyledButton = styled(MuiButton)`
  border-radius: 0.5rem;
  font-size: 16px;
  padding: 0.75rem 1rem;
  text-transform: none;
  width: 100%;
`

export default function Submit({ children }) {
  const { isSubmitting } = useFormikContext()

  return (
    <StyledButton disabled={isSubmitting} type="submit" variant="contained">
      {children}
    </StyledButton>
  )
}
