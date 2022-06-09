import { Formik, Form as FormikForm } from 'formik'
import styled from 'styled-components'

import { Checkbox } from './Checkbox'
import { Select } from './Select'
import { Submit } from './Submit'
import { Textarea } from './Textarea'
import { TextInput } from './TextInput'

import type { FormikConfig, FormikValues } from 'formik'
import type { FormHTMLAttributes } from 'react'

const StyledForm = styled(FormikForm)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

type FormComponentProps<Values extends FormikValues = FormikValues, ExtraProps = {}> = FormikConfig<Values> &
  ExtraProps &
  Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>
function FormComponent({
  children,
  initialErrors,
  initialValues,
  onSubmit,
  validate,
  validationSchema,
  ...props
}: FormComponentProps) {
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

FormComponent.name = 'Form'

export const Form = Object.assign(FormComponent, {
  Checkbox,
  Select,
  Submit,
  Textarea,
  TextInput,
})
