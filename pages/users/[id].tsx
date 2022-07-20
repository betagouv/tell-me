import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { useApi } from '@app/hooks/useApi'
import { useIsMounted } from '@app/hooks/useIsMounted'
import { Form } from '@app/molecules/Form'
import { Loader } from '@app/molecules/Loader'
import { AdminBox } from '@app/organisms/AdminBox'
import { USER_ROLE_LABEL } from '@common/constants'
import { Card, Field } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

const FormSchema = Yup.object().shape({
  email: Yup.string().required(`Email is mandatory.`).email(`This email doesn't look well formatted.`),
  roleAsOption: Yup.object().required(`Role is mandatory.`),
})

const ROLE_AS_OPTIONS = R.pipe(
  R.toPairs,
  R.map(([value, label]: [string, string]) => ({ label, value })),
)(USER_ROLE_LABEL)

export default function UserEditorPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<any>(null)
  const api = useApi()
  const intl = useIntl()
  const isMounted = useIsMounted()
  const router = useRouter()

  const { id } = router.query

  const loadUser = async () => {
    const maybeBody = await api.get(`users/${id}`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const userData = maybeBody.data
    const userEditableData: any = R.pick(['email', 'firstName', 'lastName', 'isActive'])(userData)
    userEditableData.roleAsOption = {
      label: USER_ROLE_LABEL[userData.role],
      value: userData.role,
    }

    if (isMounted()) {
      setInitialValues(userEditableData)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const updateUserAndGoBack = async (values, { setErrors, setSubmitting }) => {
    const userData: any = R.pick(['email', 'firstName', 'lastName', 'isActive'])(values)
    userData.role = values.roleAsOption.value

    const maybeBody = await api.patch(`users/${id}`, userData)
    if (maybeBody === null || maybeBody.hasError) {
      setErrors({
        email: 'Sorry, but something went wrong.',
      })
      setSubmitting(false)

      return
    }

    router.push('/users')
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
            defaultMessage: 'Edit user',
            description: '[User Editor] Edition page title.',
            id: 'FC8ax/',
          })}
        </Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues} onSubmit={updateUserAndGoBack} validationSchema={FormSchema}>
          <Form.TextInput
            label={intl.formatMessage({
              defaultMessage: 'First Name',
              description: '[User Editor] Form First Name input label.',
              id: 'UaLCH+',
            })}
            name="firstName"
          />

          <Field>
            <Form.TextInput
              label={intl.formatMessage({
                defaultMessage: 'Last Name',
                description: '[User Editor] Form Last Name input label.',
                id: 'oatzvs',
              })}
              name="lastName"
            />
          </Field>

          <Field>
            <Form.TextInput
              label={intl.formatMessage({
                defaultMessage: 'Email',
                description: '[User Editor] Form Email input label.',
                id: 'Q0wotK',
              })}
              name="email"
              type="email"
            />
          </Field>

          <Field>
            <Form.Select
              label={intl.formatMessage({
                defaultMessage: 'Role',
                description: '[User Editor] Form Role select label.',
                id: 'XJmbHw',
              })}
              name="roleAsOption"
              options={ROLE_AS_OPTIONS}
            />
          </Field>

          <Field>
            <Form.Checkbox
              label={intl.formatMessage({
                defaultMessage: 'Activated account',
                description: '[User Editor] Form activated account checkbox label.',
                id: 'VXF18U',
              })}
              name="isActive"
            />
          </Field>

          <Field>
            <Form.Submit>
              {intl.formatMessage({
                defaultMessage: 'Update',
                description: '[User Editor] Form update button label.',
                id: 'h4+RiJ',
              })}
            </Form.Submit>
          </Field>
        </Form>
      </Card>
    </AdminBox>
  )
}
