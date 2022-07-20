import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { useApi } from '@app/hooks/useApi'
import { useIsMounted } from '@app/hooks/useIsMounted'
import { Form } from '@app/molecules/Form'
import { Loader } from '@app/molecules/Loader'
import { AdminBox } from '@app/organisms/AdminBox'
import { Card, Field } from '@singularity/core'
import { FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

const FormSchema = Yup.object().shape({
  label: Yup.string().required(`Label is mandatory.`),
})

export default function PersonalAccessTokenEditorPage() {
  const [isCreated, setIsCreated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<any>(null)
  const api = useApi()
  const intl = useIntl()
  const isMounted = useIsMounted()
  const router = useRouter()

  const { id } = router.query

  const isNew = id === 'new'

  const loadPersonalAccessToken = async () => {
    const maybeBody = await api.get(`personal-access-tokens/${id}`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const personalAccessTokenData = maybeBody.data
    const personalAccessTokenEditableData: any = R.pick(['label'])(personalAccessTokenData)

    if (isMounted()) {
      setInitialValues(personalAccessTokenEditableData)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isNew) {
      setInitialValues({})
      setIsLoading(false)

      return
    }

    loadPersonalAccessToken()
  }, [])

  const updatePersonalAccessTokenAndGoBack = async (
    values,
    { setErrors, setFieldValue, setSubmitting }: FormikHelpers<any>,
  ) => {
    const personalAccessTokenData: any = R.pick(['label'])(values)

    const maybeBody = isNew
      ? await api.post(`personal-access-tokens`, values)
      : await api.patch(`personal-access-tokens/${id}`, personalAccessTokenData)
    if (maybeBody === null || maybeBody.hasError) {
      setErrors({
        email: 'Sorry, but something went wrong.',
      })
      setSubmitting(false)

      return
    }

    if (!isNew) {
      router.push('/personal-access-tokens')

      return
    }

    setFieldValue('value', maybeBody.data.value)
    setIsCreated(true)
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
          {isNew
            ? intl.formatMessage({
                defaultMessage: 'New PAT',
                description: '[Personal Access Token Editor] Creation page title.',
                id: 'QWfMAC',
              })
            : intl.formatMessage({
                defaultMessage: 'Edit PAT',
                description: '[Personal Access Token Editor] Edition page title.',
                id: 'cZz32J',
              })}
        </Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues} onSubmit={updatePersonalAccessTokenAndGoBack} validationSchema={FormSchema}>
          <Form.TextInput
            disabled={isCreated}
            label={intl.formatMessage({
              defaultMessage: 'Label',
              description: '[Personal Access Token Editor] Form Label input label.',
              id: 'Db1A9P',
            })}
            name="label"
          />

          {isCreated && (
            <Field>
              <Form.TextInput
                disabled
                label={intl.formatMessage({
                  defaultMessage: 'Value',
                  description: '[Personal Access Token Editor] Form Value input label.',
                  id: '0llMw7',
                })}
                name="value"
              />
            </Field>
          )}

          {!isCreated && (
            <Field>
              <Form.Submit>
                {isNew
                  ? intl.formatMessage({
                      defaultMessage: 'Create',
                      description: '[Personal Access Token Editor] Form create button label.',
                      id: 'nsfyN3',
                    })
                  : intl.formatMessage({
                      defaultMessage: 'Update',
                      description: '[Personal Access Token Editor] Form update button label.',
                      id: '7LF9Gb',
                    })}
              </Form.Submit>
            </Field>
          )}
        </Form>
      </Card>
    </AdminBox>
  )
}
