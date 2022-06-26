import { withFormik } from 'formik'

import type { CompositeComponent, FormikErrors } from 'formik'
import type { ObjectSchema } from 'yup'

export type FormProps<V> = {
  initialValues: Partial<V>
  onSubmit: (values: Partial<V>) => Promise<undefined | FormikErrors<V>>
}

export function withCustomFormik<V>(
  FormComponent: CompositeComponent<FormProps<V>>,
  validationSchema: ObjectSchema<any>,
) {
  return withFormik<FormProps<V>, Partial<V>>({
    handleSubmit: async (values, { props: { onSubmit }, setErrors, setSubmitting }) => {
      const errors = await onSubmit(values)
      if (errors !== undefined) {
        setErrors(errors)
      }

      setSubmitting(false)
    },

    mapPropsToValues: ({ initialValues }) => initialValues,

    validationSchema,
  })(FormComponent)
}
