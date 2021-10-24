import MuiCheckbox from '@mui/material/Checkbox'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
// import { styled } from '@mui/material/styles'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'

export default function Checkbox({ isDisabled, label, name, onChange }) {
  const { handleChange, values } = useFormikContext()

  const handleFinalChange = event => {
    if (onChange !== null) {
      onChange(event)
    }

    handleChange(event)
  }

  return (
    <MuiFormControlLabel
      checked={values[name]}
      control={<MuiCheckbox name={name} />}
      disabled={isDisabled}
      label={label}
      onChange={handleFinalChange}
    />
  )
}

Checkbox.defaultProps = {
  isDisabled: false,
  onChange: null,
}

Checkbox.propTypes = {
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
}
