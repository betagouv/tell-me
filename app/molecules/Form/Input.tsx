import { TextInput } from '@singularity-ui/core'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'
import { ChangeEvent } from 'react'

export default function Input({ autoComplete, helper, isDisabled, label, name, noLabel, onChange, type }) {
  const { errors, handleChange, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? errors[name] : null

  const checkChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange !== null) {
      onChange(event)
    }

    handleChange(event)
  }

  return (
    <TextInput
      autoComplete={String(autoComplete)}
      defaultValue={values[name]}
      disabled={isDisabled}
      error={maybeError}
      helper={helper}
      label={!noLabel ? label : null}
      name={name}
      onChange={checkChange}
      placeholder={noLabel ? label : null}
      type={type}
    />
  )
}

Input.defaultProps = {
  autoComplete: null,
  helper: ' ',
  isDisabled: false,
  noLabel: false,
  onChange: null,
  type: 'text',
}

Input.propTypes = {
  autoComplete: PropTypes.string,
  helper: PropTypes.string,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  noLabel: PropTypes.bool,
  onChange: PropTypes.func,
  type: PropTypes.string,
}
