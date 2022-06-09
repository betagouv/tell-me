import { TextInput as SuiTextInput } from '@singularity/core'
import { useFormikContext } from 'formik'

import { SurveyField } from '../../atoms/SurveyField'

export function TextInput({ label, name }) {
  const { handleChange, values } = useFormikContext<any>()

  const value = values[name]

  return (
    <SurveyField>
      <SuiTextInput defaultValue={value} name={name} onChange={handleChange} placeholder={label} type="text" />
    </SurveyField>
  )
}
