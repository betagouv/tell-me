import { Textarea as SingularityTextarea } from '@singularity-ui/core'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'

export default function Textarea({ helper, isDisabled, label, name, placeholder, type }) {
  const { errors, handleChange, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? errors[name] : null

  return (
    <SingularityTextarea
      defaultValue={values[name]}
      disabled={isDisabled}
      error={maybeError}
      helper={helper}
      label={label}
      name={name}
      onChange={handleChange}
      placeholder={placeholder}
      type={type}
    />
  )
}

Textarea.defaultProps = {
  helper: ' ',
  isDisabled: false,
  placeholder: null,
  type: 'text',
}

Textarea.propTypes = {
  helper: PropTypes.string,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
}
