import { Card } from '@singularity-ui/core'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
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

const FormSchema = Yup.object().shape({
  email: Yup.string().required(`Email is mandatory.`).email(`This email doesn't look well formatted.`),
  roleAsOption: Yup.object().required(`Role is mandatory.`),
})

const ROLE_AS_OPTIONS = R.pipe(
  R.toPairs,
  R.map(([value, label]) => ({ label, value })),
)(USER_ROLE_LABEL)

export default function UserEditor() {
  const api = useApi()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState(null)
  const history = useHistory()
  const isMounted = useIsMounted()

  const isNew = id === 'new'

  const loadUser = async () => {
    const maybeBody = await api.get(`user/${id}`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const userData = maybeBody.data
    const userEditableData = R.pick(['email', 'firstName', 'lastName', 'isActive'])(userData)
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
    const userData = R.pick(['email', 'firstName', 'lastName', 'isActive'])(values)
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
    return 'Loading...'
  }

  return (
    <AdminBox>
      <AdminHeader>
        <Title>{isNew ? 'New user' : 'Edit user'}</Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues} onSubmit={updateUserAndGoBack} validationSchema={FormSchema}>
          <Form.Input label="Email" name="email" type="email" />

          {isNew && (
            <Field>
              <Form.Input label="Mot de passe" name="password" type="password" />
            </Field>
          )}

          <Field>
            <Form.Select label="Role" name="roleAsOption" options={ROLE_AS_OPTIONS} />
          </Field>

          <Field>
            <Form.Checkbox label="Active account" name="isActive" />
          </Field>

          <Field>
            <Form.Submit>{isNew ? 'Create' : 'Update'}</Form.Submit>
          </Field>
        </Form>
      </Card>
    </AdminBox>
  )
}
