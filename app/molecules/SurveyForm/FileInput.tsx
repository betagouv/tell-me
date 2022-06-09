import { FileInput as SuiFileInput } from '@singularity/core'
import { useFormikContext } from 'formik'

import { SurveyField } from '../../atoms/SurveyField'

export function FileInput({ label, name }) {
  const { setFieldValue } = useFormikContext<any>()

  const updateFieldValue = async event => {
    const [file] = event.target.files

    setFieldValue(name, file)
  }

  return (
    <SurveyField>
      <SuiFileInput name={name} onChange={updateFieldValue} placeholder={label} />
    </SurveyField>
  )
}
