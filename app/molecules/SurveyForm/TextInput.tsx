import { TextInput as SuiTextInput } from '@singularity-ui/core'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'

import SurveyField from '../../atoms/SurveyField'

export default function TextInput({ label, name }) {
  const { handleChange, values } = useFormikContext<any>()

  const value = values[name]

  return (
    <SurveyField>
      <SuiTextInput defaultValue={value} name={name} onChange={handleChange} placeholder={label} type="text" />
    </SurveyField>
  )
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}
