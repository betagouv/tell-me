import { styled } from '@mui/material/styles'
import MuiTextField from '@mui/material/TextField'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'

const StyledTextField = styled(MuiTextField)`
  margin-bottom: 1rem;

  .MuiInputLabel-root,
  .MuiInputBase-root {
    font-size: 16px;
  }

  .MuiInputBase-root {
    border-radius: 0.5rem;
    width: 100%;
  }
`

export default function Input({ autoComplete, helperText, isDisabled, label, name, onChange, type }) {
  const { errors, handleChange, submitCount, touched, values } = useFormikContext()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])

  const handleFinalChange = event => {
    if (onChange !== null) {
      onChange(event)
    }

    handleChange(event)
  }

  return (
    <StyledTextField
      autoComplete={String(autoComplete)}
      defaultValue={values[name]}
      disabled={isDisabled}
      error={hasError}
      helperText={hasError ? errors[name] : helperText}
      label={label}
      name={name}
      onChange={handleFinalChange}
      type={type}
    />
  )
}

Input.defaultProps = {
  autoComplete: null,
  helperText: ' ',
  isDisabled: false,
  onChange: null,
  type: 'text',
}

Input.propTypes = {
  autoComplete: PropTypes.string,
  helperText: PropTypes.string,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  type: PropTypes.string,
}
