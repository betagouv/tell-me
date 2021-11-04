import { Checkbox as SuiCheckbox } from '@singularity-ui/core'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'

import SurveyField from '../../atoms/SurveyField'

export default function Checkbox({ label, name, value }) {
  const { handleChange, values } = useFormikContext()

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
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}
