import { Textarea as SingularityTextarea } from '@singularity-ui/core'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'

export default function Textarea({ helper, isDisabled, label, name, type }) {
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
      type={type}
    />
  )
}

Textarea.defaultProps = {
  helper: ' ',
  isDisabled: false,
  type: 'text',
}

Textarea.propTypes = {
  helper: PropTypes.string,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
}
