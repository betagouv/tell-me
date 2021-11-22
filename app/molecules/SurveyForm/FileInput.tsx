import { FileInput as SuiFileInput } from '@singularity-ui/core'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'

import SurveyField from '../../atoms/SurveyField'

export default function FileInput({ label, name }) {
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

FileInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}
