import { Checkbox as SuiCheckbox } from '@singularity/core'
import { useFormikContext } from 'formik'
import { useCallback, useMemo } from 'react'

import type { CheckboxProps as SuiCheckboxProps } from '@singularity/core'
import type { ChangeEvent } from 'react'

type CheckboxProps = SuiCheckboxProps & {
  name: string
}
export function Checkbox({ disabled, name, ...rest }: CheckboxProps) {
  const { isSubmitting, setFieldValue, values } = useFormikContext<any>()

  const controlledDisabled = useMemo(() => disabled && isSubmitting, [disabled, isSubmitting])
  const defaultChecked = useMemo(() => Boolean(values[name]), [values[name]])

  const updateFormikValues = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, event.target.checked)
  }, [])

  return (
    <SuiCheckbox
      defaultChecked={defaultChecked}
      disabled={controlledDisabled}
      name={name}
      onChange={updateFormikValues}
      {...rest}
    />
  )
}
