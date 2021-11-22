import { TextInput as SuiTextInput } from '@singularity-ui/core'
import BetterPropTypes from 'better-prop-types'
import { useFormikContext } from 'formik'

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
  label: BetterPropTypes.string.isRequired,
  name: BetterPropTypes.string.isRequired,
}
