import { Checkbox as SuiCheckbox } from '@singularity/core'
import { useFormikContext } from 'formik'

import { SurveyField } from '../../atoms/SurveyField'

export function Checkbox({ label, name, value }) {
  const { handleChange, values } = useFormikContext<any>()

  const isChecked = Array.isArray(values[name]) && values[name].includes(value)

  return (
    <SurveyField>
      <SuiCheckbox
        defaultChecked={isChecked}
        label={label}
        name={name}
        onChange={handleChange}
        type="checkbox"
        value={value}
      />
    </SurveyField>
  )
}
