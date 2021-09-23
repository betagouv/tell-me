import { styled } from '@mui/material/styles'
import { Formik, Form as FormikForm } from 'formik'
import PropTypes from 'prop-types'
import * as Yup from 'yup'

import Input from './Input'
import Submit from './Submit'

const StyledForm = styled(FormikForm)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

function Form({ children, initialValues, onSubmit, validate, validationSchema }) {
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      validationSchema={validationSchema}
    >
      <StyledForm noValidate>{children}</StyledForm>
    </Formik>
  )
}

Form.defaultProps = {
  initialValues: {},
  validate: () => ({}),
}

Form.propTypes = {
  initialValues: PropTypes.objectOf(PropTypes.string),
  onSubmit: PropTypes.func.isRequired,
  validate: PropTypes.func,
  validationSchema: PropTypes.instanceOf(Yup.ObjectSchema).isRequired,
}

export default Object.assign(Form, {
  Input,
  Submit,
})
