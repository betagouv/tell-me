import { Select as SingularitySelect } from '@singularity-ui/core'
import BetterPropTypes from 'better-prop-types'
import { useFormikContext } from 'formik'

export default function Select({ helper, isAsync, isDisabled, isMulti, label, name, noLabel, options }) {
  const { errors, setFieldValue, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined

  const updateFormikValues = option => {
    setFieldValue(name, option)
  }

  return (
    <SingularitySelect
      cacheOptions={isAsync}
      defaultValue={values[name]}
      disabled={isDisabled}
      error={maybeError}
      helper={helper}
      isAsync={isAsync}
      isMulti={isMulti}
      label={!noLabel ? label : null}
      loadOptions={isAsync ? options : null}
      name={name}
      onChange={updateFormikValues}
      // onInputChange={isAsync ? updateFormikValues2 : null}
      options={!isAsync ? options : undefined}
      placeholder={noLabel ? label : null}
    />
  )
}

Select.defaultProps = {
  helper: ' ',
  isAsync: false,
  isDisabled: false,
  isMulti: false,
  noLabel: false,
}

Select.propTypes = {
  helper: BetterPropTypes.string,
  isAsync: BetterPropTypes.bool,
  isDisabled: BetterPropTypes.bool,
  isMulti: BetterPropTypes.bool,
  label: BetterPropTypes.string.isRequired,
  name: BetterPropTypes.string.isRequired,
  noLabel: BetterPropTypes.bool,
  options: BetterPropTypes.oneOfType([
    // eslint-disable-next-line react/forbid-prop-types
    BetterPropTypes.array,
    BetterPropTypes.func,
  ]).isRequired,
}
