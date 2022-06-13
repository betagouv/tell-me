import { Formik, Form as FormikForm, useFormikContext } from 'formik'
import debounce from 'lodash.debounce'
import { useEffect } from 'react'
import styled from 'styled-components'

import { Checkbox } from './Checkbox'
import { FileInput } from './FileInput'
import { Radio } from './Radio'
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

type FormProps<Values extends FormikValues = FormikValues, ExtraProps = {}> = FormikConfig<Values> &
  ExtraProps &
  Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>
function SurveyFormComponent({ children, initialValues, onChange, onSubmit, validate, validationSchema }: FormProps) {
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

SurveyFormComponent.displayName = 'SurveyForm'

export const SurveyForm = Object.assign(SurveyFormComponent, {
  Checkbox,
  FileInput,
  Radio,
  Submit,
  Textarea,
  TextInput,
})
