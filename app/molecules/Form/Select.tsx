import { Select as SingularitySelect } from '@singularity-ui/core'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'

export default function Select({ helper, isAsync, isDisabled, isMulti, label, name, noLabel, options }) {
  const { errors, setFieldValue, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? errors[name] : null

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
  helper: PropTypes.string,
  isAsync: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  noLabel: PropTypes.bool,
  options: PropTypes.oneOfType([
    // eslint-disable-next-line react/forbid-prop-types
    PropTypes.array,
    PropTypes.func,
  ]).isRequired,
}
