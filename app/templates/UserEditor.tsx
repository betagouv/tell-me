import { Card } from '@singularity-ui/core'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import * as Yup from 'yup'

import { USER_ROLE_LABEL } from '../../common/constants'
import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Field from '../atoms/Field'
import Title from '../atoms/Title'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'
import Form from '../molecules/Form'
import Loader from '../molecules/Loader'

const FormSchema = Yup.object().shape({
  email: Yup.string().required(`Email is mandatory.`).email(`This email doesn't look well formatted.`),
  roleAsOption: Yup.object().required(`Role is mandatory.`),
})

const ROLE_AS_OPTIONS = R.pipe(
  R.toPairs,
  R.map(([value, label]) => ({ label, value })),
)(USER_ROLE_LABEL)

export default function UserEditor() {
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<any>(null)
  const { id } = useParams()
  const history = useHistory()
  const intl = useIntl()
  const isMounted = useIsMounted()
  const api = useApi()

  const isNew = id === 'new'

  const loadUser = async () => {
    const maybeBody = await api.get(`user/${id}`)
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
    if (isNew) {
      setInitialValues({})
      setIsLoading(false)

      return
    }

    loadUser()
  }, [])

  const updateUserAndGoBack = async (values, { setErrors, setSubmitting }) => {
    const userData: any = R.pick(['email', 'firstName', 'lastName', 'isActive'])(values)
    userData.role = values.roleAsOption.value

    const maybeBody = isNew ? await api.post(`user/${id}`, values) : await api.patch(`user/${id}`, userData)
    if (maybeBody === null || maybeBody.hasError) {
      setErrors({
        email: 'Sorry, but something went wrong.',
      })
      setSubmitting(false)

      return
    }

    history.goBack()
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
                defaultMessage: 'New user',
                description: '[Survey Editor] User creation page title.',
                id: 'SbH89J',
              })
            : intl.formatMessage({
                defaultMessage: 'Edit user',
                description: '[Survey Editor] User edition page title.',
                id: 'FC8ax/',
              })}
        </Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues} onSubmit={updateUserAndGoBack} validationSchema={FormSchema}>
          <Form.Input
            label={intl.formatMessage({
              defaultMessage: 'Email',
              description: '[Survey Editor] Form email input label.',
              id: 'Q0wotK',
            })}
            name="email"
            type="email"
          />

          {isNew && (
            <Field>
              <Form.Input
                label={intl.formatMessage({
                  defaultMessage: 'Password',
                  description: '[Survey Editor] Form password input label.',
                  id: 'AOWpq6',
                })}
                name="password"
                type="password"
              />
            </Field>
          )}

          <Field>
            <Form.Select
              label={intl.formatMessage({
                defaultMessage: 'Role',
                description: '[Survey Editor] Form role select label.',
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
                description: '[Survey Editor] Form activated account checkbox label.',
                id: 'VXF18U',
              })}
              name="isActive"
            />
          </Field>

          <Field>
            <Form.Submit>
              {isNew
                ? intl.formatMessage({
                    defaultMessage: 'Create user',
                    description: '[Survey Editor] Form create button label.',
                    id: 'd97zYv',
                  })
                : intl.formatMessage({
                    defaultMessage: 'Update user',
                    description: '[Survey Editor] Form update button label.',
                    id: 'h4+RiJ',
                  })}
            </Form.Submit>
          </Field>
        </Form>
      </Card>
    </AdminBox>
  )
}
