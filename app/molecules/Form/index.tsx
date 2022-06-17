import { Formik, Form as FormikForm } from 'formik'
import styled from 'styled-components'

import { Checkbox } from './Checkbox'
import { Select } from './Select'
import { Submit } from './Submit'
import { Textarea } from './Textarea'
import { TextInput } from './TextInput'

import type { FormikConfig, FormikValues } from 'formik'
import type { FormHTMLAttributes } from 'react'

const Box = styled.div<{
  withTopMargin: boolean
}>`
  display: flex;
  flex-direction: column;
  margin-top: ${p => (p.withTopMargin ? p.theme.padding.layout.medium : 0)};
  width: 100%;
`

type FormComponentProps<Values extends FormikValues = FormikValues, ExtraProps = {}> = FormikConfig<Values> &
  ExtraProps &
  Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
    withTopMargin?: boolean
  }
function FormComponent({
  children,
  initialErrors,
  initialValues,
  onSubmit,
  validate,
  validationSchema,
  withTopMargin = false,
  ...props
}: FormComponentProps) {
  return (
    <Box withTopMargin={withTopMargin}>
      <Formik
        enableReinitialize
        initialErrors={initialErrors}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
        validationSchema={validationSchema}
      >
        <FormikForm noValidate {...props}>
          {children}
        </FormikForm>
      </Formik>
    </Box>
  )
}

FormComponent.displayName = 'Form'

export const Form = Object.assign(FormComponent, {
  Checkbox,
  Select,
  Submit,
  Textarea,
  TextInput,
})
