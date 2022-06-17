import { Select as SingularitySelect } from '@singularity/core'
import { useFormikContext } from 'formik'
import { useCallback, useMemo } from 'react'

import type { SelectProps as SuiSelectProps } from '@singularity/core'

type SelectProps = SuiSelectProps & {
  name: string
}
export function Select({ isDisabled = false, name, ...rest }: SelectProps) {
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()

  const controlledIsDisabled = useMemo(() => isDisabled && isSubmitting, [isDisabled, isSubmitting])
  const defaultValue = useMemo(() => values[name], [values[name]])
  const maybeError = useMemo(() => {
    const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])

    return hasError ? String(errors[name]) : undefined
  }, [errors[name], touched[name], submitCount])

  const updateFormikValues = useCallback(option => {
    setFieldValue(name, option)
  }, [])

  return (
    <SingularitySelect
      defaultValue={defaultValue}
      error={maybeError}
      isClearable
      isDisabled={controlledIsDisabled}
      isLoading={isSubmitting}
      name={name}
      onChange={updateFormikValues}
      {...rest}
    />
  )
}
