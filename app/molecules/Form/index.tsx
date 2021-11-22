import BetterPropTypes from 'better-prop-types'
import { Formik, Form as FormikForm } from 'formik'
import styled from 'styled-components'
import * as Yup from 'yup'

import Checkbox from './Checkbox'
import Input from './Input'
import Select from './Select'
import Submit from './Submit'
import Textarea from './Textarea'

const StyledForm = styled(FormikForm)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

function Form({ autoComplete, children, initialValues, onSubmit, validate, validationSchema }) {
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      validationSchema={validationSchema}
    >
      <StyledForm autoComplete={String(autoComplete)} noValidate>
        {children}
      </StyledForm>
    </Formik>
  )
}

Form.defaultProps = {
  autoComplete: false,
  initialValues: {},
  validate: () => ({}),
}

Form.propTypes = {
  autoComplete: BetterPropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  initialValues: BetterPropTypes.any,
  onSubmit: BetterPropTypes.func.isRequired,
  validate: BetterPropTypes.func,
  validationSchema: BetterPropTypes.instanceOf(Yup.ObjectSchema).isRequired,
}

export default Object.assign(Form, {
  Checkbox,
  Input,
  Select,
  Submit,
  Textarea,
})
