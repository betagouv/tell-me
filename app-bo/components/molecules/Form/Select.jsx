import MuiMenuItem from '@mui/material/MenuItem'
import MuiSelect from '@mui/material/Select'
// import { styled } from '@mui/material/styles'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'

export default function Select({ isDisabled, label, name, onChange, options }) {
  const { handleChange, values } = useFormikContext()

  const handleFinalChange = event => {
    if (onChange !== null) {
      onChange(event)
    }

    handleChange(event)
  }

  return (
    <MuiSelect disabled={isDisabled} label={label} name={name} onChange={handleFinalChange} value={values[name]}>
      {options.map(([value, label]) => (
        <MuiMenuItem key={value} value={value}>
          {label}
        </MuiMenuItem>
      ))}
    </MuiSelect>
  )
}

Select.defaultProps = {
  isDisabled: false,
  onChange: null,
}

Select.propTypes = {
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array.isRequired,
}
