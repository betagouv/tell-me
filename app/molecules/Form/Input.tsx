import { TextInput } from '@singularity/core'
import BetterPropTypes from 'better-prop-types'
import { useFormikContext } from 'formik'
import { ChangeEvent } from 'react'

export default function Input({ autoComplete, helper, isDisabled, label, name, noLabel, onChange, type }) {
  const { errors, handleChange, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined

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
  autoComplete: BetterPropTypes.string,
  helper: BetterPropTypes.string,
  isDisabled: BetterPropTypes.bool,
  label: BetterPropTypes.string.isRequired,
  name: BetterPropTypes.string.isRequired,
  noLabel: BetterPropTypes.bool,
  onChange: BetterPropTypes.func,
  type: BetterPropTypes.string,
}
