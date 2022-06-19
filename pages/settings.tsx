import { AdminHeader } from '@app/atoms/AdminHeader'
import { CardTitle } from '@app/atoms/CardTitle'
import { Title } from '@app/atoms/Title'
import { useApi } from '@app/hooks/useApi'
import { useIsMounted } from '@app/hooks/useIsMounted'
import { Form } from '@app/molecules/Form'
import { Loader } from '@app/molecules/Loader'
import { AdminBox } from '@app/organisms/AdminBox'
import { GlobalVariableKey } from '@common/constants'
import { GlobalVariable } from '@prisma/client'
import { Card, Field } from '@singularity/core'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

const FormSchema = Yup.object().shape({
  [GlobalVariableKey.BASE_URL]: Yup.string().trim().nullable().url("This URL doesn't look right."),
  [GlobalVariableKey.S3_ACCESS_KEY]: Yup.string().trim().nullable(),
  [GlobalVariableKey.S3_BUCKET]: Yup.string().trim().nullable(),
  [GlobalVariableKey.S3_ENDPOINT]: Yup.string().trim().nullable(),
  [GlobalVariableKey.S3_PORT]: Yup.number().nullable(),
  [GlobalVariableKey.S3_SECRET_KEY]: Yup.string().trim().nullable(),
  [GlobalVariableKey.S3_URL]: Yup.string().trim().nullable().url("This URL doesn't look right."),
})

export default function SettingsPage() {
  const api = useApi()
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<Partial<Record<GlobalVariableKey, string | null>>>({})
  const intl = useIntl()
  const isMounted = useIsMounted()

  const load = async () => {
    const maybeBody = await api.get<GlobalVariable[]>(`global-variables`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const globalVariables = maybeBody.data
    const globalVariablesAsInitialValues = Object.fromEntries(globalVariables.map(({ key, value }) => [key, value]))

    if (isMounted()) {
      setInitialValues(globalVariablesAsInitialValues)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const update = async (values, { setSubmitting }) => {
    const globalVariableKeys = Object.keys(values)

    await Promise.all(
      globalVariableKeys.map(async globalVariableKey => {
        const value = values[globalVariableKey]
        const stringOrNullValue = typeof value === 'number' ? String(value) : value
        const normalizedValue =
          typeof stringOrNullValue === 'string' && stringOrNullValue.trim().length === 0 ? null : stringOrNullValue

        await api.patch(`global-variables/${globalVariableKey}`, {
          value: normalizedValue,
        })
      }),
    )

    setSubmitting(false)
  }

  if (isLoading) {
    return (
      <AdminBox>
        <Loader />
      </AdminBox>
    )
  }

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'Global Settings',
            description: '[Settings Page] Title.',
            id: 'SETTINGS_PAGE__TITLE',
          })}
        </Title>
      </AdminHeader>

      <Form initialValues={initialValues} onSubmit={update} validationSchema={FormSchema}>
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
      </Form>
    </AdminBox>
  )
}
