import { Textarea as SuiTextarea } from '@singularity/core'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import { SurveyField } from '../../atoms/SurveyField'

const StyledTextarea = styled(SuiTextarea)`
  .Textarea {
    height: 5.5rem;
  }
`

export function Textarea({ label, name }) {
  const { handleChange, values } = useFormikContext<any>()

  const value = values[name]

  return (
    <SurveyField>
      <StyledTextarea defaultValue={value} name={name} onChange={handleChange} placeholder={label} />
    </SurveyField>
  )
}
