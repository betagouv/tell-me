import { CardTitle } from '@app/atoms/CardTitle'
import { withCustomFormik } from '@app/hocs/withCustomFormik'
import { useLocalization } from '@app/hooks/useLocalization'
import { Form } from '@app/molecules/Form'
import { GlobalVariableKey } from '@common/constants'
import { Card, Field } from '@singularity/core'
import { Form as FormikForm } from 'formik'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

import type { FormProps } from '@app/hocs/withCustomFormik'

export type GlobalSettingsFormValues = Record<GlobalVariableKey, string>

function GlobalSettingsFormComponent() {
  const intl = useIntl()

  return (
    <FormikForm>
      <Card>
        <Field>
          <Form.TextInput
            label={intl.formatMessage({
              defaultMessage: 'Base URL',
              description: '[Settings Form] Base URL input label.',
              id: 'SETTINGS_FORM__BASE_URL_INPUT_LABEL:',
            })}
            name={GlobalVariableKey.BASE_URL}
          />
        </Field>
      </Card>

      <Card style={{ marginTop: '1rem' }}>
        <CardTitle isFirst>
          {intl.formatMessage({
            defaultMessage: 'S3-compatible Static Assets Server',
            description: '[Settings Form] S3 subtitle.',
            id: 'SETTINGS_FORM__S3_SUBTITLE',
          })}
        </CardTitle>

        <Field>
          <Form.TextInput
            label={intl.formatMessage({
              defaultMessage: 'Endpoint',
              description: '[Settings Form] S3 Endpoint input label.',
              id: 'SETTINGS_FORM__S3_ENDPOINT_INPUT_LABEL',
            })}
            name={GlobalVariableKey.S3_ENDPOINT}
            placeholder="s3.amazonaws.com"
          />
        </Field>

        <Field>
          <Form.TextInput
            helper={intl.formatMessage({
              defaultMessage: 'Only required for MinIO custom servers.',
              description: '[Settings Form] S3 Port input helper.',
              id: 'SETTINGS_FORM__S3_PORT_INPUT_HELPER',
            })}
            label={intl.formatMessage({
              defaultMessage: 'Port',
              description: '[Settings Form] S3 Port input label.',
              id: 'SETTINGS_FORM__S3_PORT_INPUT_LABEL',
            })}
            name={GlobalVariableKey.S3_PORT}
            type="number"
          />
        </Field>

        <Field>
          <Form.TextInput
            label={intl.formatMessage({
              defaultMessage: 'Access Key',
              description: '[Settings Form] S3 Access Key input label.',
              id: 'SETTINGS_FORM__S3_ACCESS_KEY_INPUT_LABEL',
            })}
            name={GlobalVariableKey.S3_ACCESS_KEY}
          />
        </Field>

        <Field>
          <Form.TextInput
            label={intl.formatMessage({
              defaultMessage: 'Secret Key',
              description: '[Settings Form] S3 Secret Key input label.',
              id: 'SETTINGS_FORM__S3_SECRET_KEY_INPUT_LABEL',
            })}
            name={GlobalVariableKey.S3_SECRET_KEY}
          />
        </Field>

        <Form.TextInput
          label={intl.formatMessage({
            defaultMessage: 'Bucket',
            description: '[Settings Form] S3 Bucket input label.',
            id: 'SETTINGS_FORM__S3_BUCKET_INPUT_LABEL',
          })}
          name={GlobalVariableKey.S3_BUCKET}
          placeholder="tell-me-assets"
        />

        <Form.TextInput
          label={intl.formatMessage({
            defaultMessage: 'Public URL',
            description: '[Settings Form] S3 Public URL input label.',
            id: 'SETTINGS_FORM__S3_URL_INPUT_LABEL',
          })}
          name={GlobalVariableKey.S3_URL}
          placeholder="https://tell-me-assets.s3.eu-west-3.amazonaws.com"
        />
      </Card>

      <Card style={{ marginTop: '1rem' }}>
        <Field>
          <Form.Submit>
            {intl.formatMessage({
              defaultMessage: 'Update',
              description: '[Settings Form] Form update button label.',
              id: 'SETTINGS_FORM__UPDATE_BUTTON_LABEL',
            })}
          </Form.Submit>
        </Field>
      </Card>
    </FormikForm>
  )
}

export function GlobalSettingsForm(props: FormProps<GlobalSettingsFormValues>) {
  const localization = useLocalization()
  // const intl = useIntl()

  const formSchema = useMemo(
    () =>
      Yup.object().shape({
        [GlobalVariableKey.BASE_URL]: Yup.string().trim().nullable().url("This URL doesn't look right."),
        [GlobalVariableKey.S3_ACCESS_KEY]: Yup.string().trim().nullable(),
        [GlobalVariableKey.S3_BUCKET]: Yup.string().trim().nullable(),
        [GlobalVariableKey.S3_ENDPOINT]: Yup.string().trim().nullable(),
        [GlobalVariableKey.S3_PORT]: Yup.number().nullable(),
        [GlobalVariableKey.S3_SECRET_KEY]: Yup.string().trim().nullable(),
        [GlobalVariableKey.S3_URL]: Yup.string().trim().nullable().url("This URL doesn't look right."),
      }),
    [localization.locale],
  )

  const WrappedComponent = useMemo(
    () => withCustomFormik<GlobalSettingsFormValues>(GlobalSettingsFormComponent, formSchema),
    [localization.locale],
  )

  return <WrappedComponent {...props} />
}
