import { Textarea as SuiTextarea } from '@singularity-ui/core'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import SurveyField from '../../atoms/SurveyField'

const StyledTextarea = styled(SuiTextarea)`
  .Textarea {
    height: 5.5rem;
  }
`

export default function Textarea({ label, name }) {
  const { handleChange, values } = useFormikContext<any>()
  const value = values[name]

  return (
    <SurveyField>
      <StyledTextarea defaultValue={value} name={name} onChange={handleChange} placeholder={label} type="text" />
    </SurveyField>
  )
}

Textarea.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}
