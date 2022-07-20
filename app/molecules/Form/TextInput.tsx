import { TextInput as SuiTextInput } from '@singularity/core'
import { useFormikContext } from 'formik'
import { useCallback, useMemo } from 'react'

import type { TextInputProps as SuiTextInputProps } from '@singularity/core'
import type { ChangeEvent, ChangeEventHandler } from 'react'

type TextInputProps = SuiTextInputProps & {
  name: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}
export function TextInput({ autoComplete = 'off', disabled, name, onChange, type = 'text', ...props }: TextInputProps) {
  const { errors, handleChange, isSubmitting, submitCount, touched, values } = useFormikContext<any>()

  const controlledDisabled = useMemo(() => disabled && isSubmitting, [disabled, isSubmitting])
  const defaultVaLue = useMemo(() => values[name], [values[name]])
  const maybeError = useMemo(() => {
    const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])

    return hasError ? String(errors[name]) : undefined
  }, [errors[name], touched[name], submitCount])

  const controlChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (onChange !== undefined) {
      onChange(event)
    }

    handleChange(event)
  }, [])

  return (
    <SuiTextInput
      autoComplete={autoComplete}
      defaultValue={defaultVaLue}
      disabled={controlledDisabled}
      error={maybeError}
      name={name}
      onChange={controlChange}
      type={type}
      {...props}
    />
  )
}
