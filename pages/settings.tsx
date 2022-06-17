import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { useApi } from '@app/hooks/useApi'
import { useIsMounted } from '@app/hooks/useIsMounted'
import { Form } from '@app/molecules/Form'
import { Loader } from '@app/molecules/Loader'
import { AdminBox } from '@app/organisms/AdminBox'
import { GlobalVariable } from '@prisma/client'
import { Card, Field } from '@singularity/core'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

import type { GlobalVariableKey } from '@api/libs/globalVariable'

const FormSchema = Yup.object().shape({
  BASE_URL: Yup.string().nullable().url(`This URL doesn't look right.`),
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
        await api.patch(`global-variables/${globalVariableKey}`, {
          value: values[globalVariableKey],
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

      <Card>
        <Form initialValues={initialValues} onSubmit={update} validationSchema={FormSchema}>
          <Field>
            <Form.TextInput
              label={intl.formatMessage({
                defaultMessage: 'Base URL',
                description: '[Settings Form] Base URL input label.',
                id: 'SETTINGS_FORM__BASE_URL_INPUT_LABEL:',
              })}
              name="BASE_URL"
            />
          </Field>

          <Field>
            <Form.Submit>
              {intl.formatMessage({
                defaultMessage: 'Update',
                description: '[Settings Form] Form update button label.',
                id: 'SETTINGS_FORM__UPDATE_BUTTON_LABEL',
              })}
            </Form.Submit>
          </Field>
        </Form>
      </Card>
    </AdminBox>
  )
}
