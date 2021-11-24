import { Card } from '@singularity-ui/core'
import { FormikHelpers } from 'formik'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Field from '../atoms/Field'
import Title from '../atoms/Title'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'
import Form from '../molecules/Form'
import Loader from '../molecules/Loader'

const FormSchema = Yup.object().shape({
  name: Yup.string().required(`Name is mandatory.`),
})

export default function PersonalAccessTokenEditor() {
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<any>(null)
  const [isCreated, setIsCreated] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const intl = useIntl()
  const isMounted = useIsMounted()
  const api = useApi()

  const isNew = id === 'new'

  const loadPersonalAccessToken = async () => {
    const maybeBody = await api.get(`personal-access-token/${id}`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const personalAccessTokenData = maybeBody.data
    const personalAccessTokenEditableData: any = R.pick(['name'])(personalAccessTokenData)

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
    const personalAccessTokenData: any = R.pick(['name'])(values)

    const maybeBody = isNew
      ? await api.post(`personal-access-token`, values)
      : await api.patch(`personal-access-token/${id}`, personalAccessTokenData)
    if (maybeBody === null || maybeBody.hasError) {
      setErrors({
        email: 'Sorry, but something went wrong.',
      })
      setSubmitting(false)

      return
    }

    if (!isNew) {
      navigate(-1)

      return
    }

    setFieldValue('value', maybeBody.data.value)
    setIsCreated(true)
  }

  if (isLoading) {
    return <Loader />
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
          <Form.Input
            isDisabled={isCreated}
            label={intl.formatMessage({
              defaultMessage: 'Name',
              description: '[Personal Access Token Editor] Form name input label.',
              id: 'Db1A9P',
            })}
            name="name"
          />

          {isCreated && (
            <Field>
              <Form.Input
                isDisabled
                label={intl.formatMessage({
                  defaultMessage: 'Value',
                  description: '[Personal Access Token Editor] Form value input label.',
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
