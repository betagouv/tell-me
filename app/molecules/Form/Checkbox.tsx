import { Checkbox as SingularityCheckbox } from '@singularity/core'
import { useFormikContext } from 'formik'

type CheckboxProps = {
  isDisabled?: boolean
  label: string
  name: string
}
export function Checkbox({ isDisabled, label, name }: CheckboxProps) {
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
