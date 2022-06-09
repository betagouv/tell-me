import { Radio as SuiRadio } from '@singularity/core'
import { useFormikContext } from 'formik'

import { SurveyField } from '../../atoms/SurveyField'

export function Radio({ countLetter, label, name, value }) {
  const { handleChange, values } = useFormikContext<any>()

  const isChecked = value === values[name]

  return (
    <SurveyField>
      <SuiRadio
        defaultChecked={isChecked}
        label={label}
        letter={countLetter}
        name={name}
        onChange={handleChange}
        type="radio"
        value={value}
      />
    </SurveyField>
  )
}
