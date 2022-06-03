import { Checkbox as SingularityCheckbox } from '@singularity/core'
import BetterPropTypes from 'better-prop-types'
import { useFormikContext } from 'formik'

export default function Checkbox({ isDisabled, label, name }) {
  const { setFieldValue, values } = useFormikContext<any>()

  const isChecked = Boolean(values[name])

  const updateFormikValues = event => {
    setFieldValue(name, event.target.checked)
  }

  return (
    <SingularityCheckbox
      defaultChecked={isChecked}
      disabled={isDisabled}
      label={label}
      name={name}
      onChange={updateFormikValues}
    />
  )
}

Checkbox.defaultProps = {
  isDisabled: false,
}

Checkbox.propTypes = {
  isDisabled: BetterPropTypes.bool,
  label: BetterPropTypes.string.isRequired,
  name: BetterPropTypes.string.isRequired,
}
