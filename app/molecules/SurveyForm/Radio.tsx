import { Radio as SuiRadio } from '@singularity/core'
import BetterPropTypes from 'better-prop-types'
import { useFormikContext } from 'formik'

import SurveyField from '../../atoms/SurveyField'

export default function Radio({ countLetter, label, name, value }) {
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

Radio.propTypes = {
  countLetter: BetterPropTypes.string.isRequired,
  label: BetterPropTypes.string.isRequired,
  name: BetterPropTypes.string.isRequired,
  value: BetterPropTypes.string.isRequired,
}
