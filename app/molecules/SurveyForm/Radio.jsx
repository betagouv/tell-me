import { Radio as SuiRadio } from '@singularity-ui/core'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'

import SurveyField from '../../atoms/SurveyField.tsx'

export default function Radio({ countLetter, label, name, value }) {
  const { handleChange, values } = useFormikContext()

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

Radio.propTypes = {
  countLetter: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}
