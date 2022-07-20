import { Textarea as SingularityTextarea } from '@singularity/core'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import type { TextareaProps as SuiTextareaProps } from '@singularity/core'

type TextareaProps = SuiTextareaProps & {
  name: string
}
export function Textarea({ autoComplete = 'off', disabled = false, name, ...rest }: TextareaProps) {
  const { errors, handleChange, isSubmitting, submitCount, touched, values } = useFormikContext<any>()

  const controlledDisabled = useMemo(() => disabled && isSubmitting, [disabled, isSubmitting])
  const defaultValue = useMemo(() => values[name], [values[name]])
  const maybeError = useMemo(() => {
    const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])

    return hasError ? String(errors[name]) : undefined
  }, [errors[name], touched[name], submitCount])

  return (
    <SingularityTextarea
      autoComplete={autoComplete}
      defaultValue={defaultValue}
      disabled={controlledDisabled}
      error={maybeError}
      name={name}
      onChange={handleChange}
      {...rest}
    />
  )
}
