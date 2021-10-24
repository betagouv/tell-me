import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import MuiBox from '@mui/material/Box'
import MuiButton from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { useFormikContext } from 'formik'

const Container = styled(MuiBox)`
  margin-top: 1.5rem;
`

const StyledButton = styled(MuiButton)`
  align-items: center;
  background: rgb(0, 0, 0);
  border-radius: 5px;
  border: 0px;
  color: rgb(255, 255, 255);
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: bold;
  height: 32px;
  justify-content: center;
  outline: none;
  padding: 0 0.25rem 0 0.75rem;
  position: relative;
  text-align: left;
  transition: color 100ms ease-in 0s;

  :hover {
    background-color: rgb(0, 0, 0);
    color: rgb(255, 255, 255);
    opacity: 0.75;
  }
`

const StyledIcon = styled(KeyboardArrowRightOutlinedIcon)`
  margin-left: 0.5rem;
`

export default function Submit({ children }) {
  const { isSubmitting } = useFormikContext()

  return (
    <Container>
      <StyledButton disabled={isSubmitting} type="submit" variant="contained">
        {children}

        <StyledIcon fontSize="small" />
      </StyledButton>
    </Container>
  )
}
