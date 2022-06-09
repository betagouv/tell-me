import { Formik, Form as FormikForm } from 'formik'
import styled from 'styled-components'

import Checkbox from './Checkbox'
import Input from './Input'
import Select from './Select'
import Submit from './Submit'
import Textarea from './Textarea'

import type { FormikConfig, FormikValues } from 'formik'
import type { FormHTMLAttributes } from 'react'

const StyledForm = styled(FormikForm)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

type FormProps<Values extends FormikValues = FormikValues, ExtraProps = {}> = FormikConfig<Values> &
  ExtraProps &
  Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>
function Form({ children, initialErrors, initialValues, onSubmit, validate, validationSchema, ...props }: FormProps) {
  return (
    <Formik
      enableReinitialize
      initialErrors={initialErrors}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      validationSchema={validationSchema}
    >
      <StyledForm noValidate {...props}>
        {children}
      </StyledForm>
    </Formik>
  )
}

export default Object.assign(Form, {
  Checkbox,
  Input,
  Select,
  Submit,
  Textarea,
})
