import { Checkbox as SuiCheckbox } from '@singularity/core'
import BetterPropTypes from 'better-prop-types'
import { useFormikContext } from 'formik'

import SurveyField from '../../atoms/SurveyField'

export default function Checkbox({ label, name, value }) {
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

Checkbox.propTypes = {
  label: BetterPropTypes.string.isRequired,
  name: BetterPropTypes.string.isRequired,
  value: BetterPropTypes.string.isRequired,
}
