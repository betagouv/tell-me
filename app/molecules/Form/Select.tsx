import { Select as SingularitySelect } from '@singularity/core'
import { useFormikContext } from 'formik'

type SelectProps = {
  helper?: string
  isAsync?: boolean
  isDisabled?: boolean
  isMulti?: boolean
  label: string
  name: string
  noLabel?: boolean
  options?: Common.App.SelectOption[]
  placeholder?: string
}
export function Select({
  helper,
  isAsync = false,
  isDisabled = false,
  isMulti = false,
  label,
  noLabel = false,
  name,
  options = [],
  placeholder,
}: SelectProps) {
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
      error={maybeError}
      helper={helper}
      isAsync={isAsync}
      isClearable
      isDisabled={isDisabled}
      isMulti={isMulti}
      label={!noLabel ? label : undefined}
      name={name}
      onChange={updateFormikValues}
      options={!isAsync ? options : undefined}
      placeholder={placeholder}
    />
  )
}
