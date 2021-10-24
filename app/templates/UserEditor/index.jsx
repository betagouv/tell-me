import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import * as Yup from 'yup'

import { USER_ROLE } from '../../../common/constants'
import useApi from '../../hooks/useApi'
import Form from '../../molecules/Form'
import Loader from '../../molecules/Loader'

const FormSchema = Yup.object().shape({
  email: Yup.string().required(`Email field is mandatory.`).email(`This email doesn't look well formatted.`),
})

export default function UserEditor() {
  const api = useApi()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState(null)
  const history = useHistory()

  useEffect(() => {
    ;(async () => {
      const maybeBody = await api.get(`user/${id}`)
      if (maybeBody === null) {
        return
      }

      const userEditableData = R.pick(['email', 'isActive', 'role'])(maybeBody.data)
      setInitialValues(userEditableData)
      setIsLoading(false)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateUserAndGoBackToList = async (values, { setErrors, setSubmitting }) => {
    const maybeBody = await api.patch(`user/${id}`, values)
    if (maybeBody === null || maybeBody.hasError) {
      setErrors({
        email: 'Sorry, but something went wrong.',
      })
      setSubmitting(false)

      return
    }

    history.push('/users')
  }

  // const getSessionJwtAndLogIn = async (values, { setErrors, setSubmitting }) => {
  //   const body = await api.post('auth/login', values)
  //   if (body === null) {
  //     setErrors({
  //       email: 'Sorry, but something went wrong.',
  //     })
  //     setSubmitting(false)

  //     return
  //   }

  //   if (body.hasError) {
  //     if (body.code === 401) {
  //       setErrors({
  //         email: 'Wrong email and/or password.',
  //         password: 'Wrong email and/or password.',
  //       })
  //       setSubmitting(false)

  //       return
  //     }

  //     if (body.code === 403) {
  //       setErrors({
  //         email: 'Your account is not active.',
  //       })
  //       setSubmitting(false)

  //       return
  //     }
  //   }

  //   await logIn(body.data.sessionToken, body.data.refreshToken)
  // }

  if (isLoading) {
    return <Loader />
  }

  return (
    <Form initialValues={initialValues} onSubmit={updateUserAndGoBackToList} validationSchema={FormSchema}>
      <Form.Input label="Email" name="email" type="email" />
      <Form.Select
        label="Role"
        name="role"
        options={[
          [USER_ROLE.ADMINISTRATOR, 'Administrator'],
          [USER_ROLE.MANAGER, 'Manager'],
          [USER_ROLE.VIEWER, 'Viewer'],
        ]}
      />
      <Form.Checkbox label="Active" name="isActive" />

      <Form.Submit>Update</Form.Submit>
    </Form>
  )
}
