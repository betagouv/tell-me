import { Textarea as SingularityTextarea } from '@singularity/core'
import { useFormikContext } from 'formik'

export function Textarea({ helper, isDisabled, label, name, placeholder }) {
  const { errors, handleChange, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined

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
    />
  )
}
