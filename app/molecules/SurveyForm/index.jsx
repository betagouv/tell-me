import { styled } from '@singularity-ui/core'
import { Formik, Form as FormikForm, useFormikContext } from 'formik'
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import * as Yup from 'yup'

import CheckboxInput from './CheckboxInput'
import RadioInput from './RadioInput'
import Submit from './Submit'
import Textarea from './Textarea'
import TextInput from './TextInput'

const StyledForm = styled(FormikForm)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const FormListener = ({ children, onChange }) => {
  const { isSubmitting, values } = useFormikContext()

  useEffect(() => {
    if (!onChange || isSubmitting) {
      return
    }

    onChange(values)
  })

  return children
}

function SurveyForm({ children, initialValues, onChange, onSubmit, validate, validationSchema }) {
  const onChangeDebounced = onChange ? debounce(onChange, 250) : onChange

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      validationSchema={validationSchema}
    >
      <FormListener onChange={onChangeDebounced}>
        <StyledForm noValidate>{children}</StyledForm>
      </FormListener>
    </Formik>
  )
}

SurveyForm.defaultProps = {
  initialValues: {},
  onChange: null,
  validate: () => ({}),
}

SurveyForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  initialValues: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  validate: PropTypes.func,
  validationSchema: PropTypes.instanceOf(Yup.ObjectSchema).isRequired,
}

export default Object.assign(SurveyForm, {
  CheckboxInput,
  RadioInput,
  Submit,
  Textarea,
  TextInput,
})
