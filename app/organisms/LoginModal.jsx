import { useIntl } from 'react-intl'
import * as Yup from 'yup'

import Field from '../atoms/Field.tsx'
import Title from '../atoms/Title.tsx'
import useApi from '../hooks/useApi'
import useAuth from '../hooks/useAuth'
import Form from '../molecules/Form'
import Modal from '../molecules/Modal'

const FormSchema = Yup.object().shape({
  email: Yup.string().required(`Please enter your email address.`).email(`This email doesn't seem well formatted.`),
  password: Yup.string().required(`Please enter your password.`),
})

export default function LoginModal() {
  const intl = useIntl()
  const api = useApi()
  const { logIn, user } = useAuth()

  const hasUserEmail = user?.email !== undefined

  const formInitialValues = {
    email: hasUserEmail ? user.email : '',
    password: '',
  }

  const getSessionJwtAndLogIn = async (values, { setErrors, setSubmitting }) => {
    const body = await api.post('auth/login', values)
    if (body === null) {
      setErrors({
        email: 'Sorry, but something went wrong.',
      })
      setSubmitting(false)

      return
    }

    if (body.hasError) {
      if (body.code === 401) {
        setErrors({
          email: 'Wrong email and/or password.',
          password: 'Wrong email and/or password.',
        })
        setSubmitting(false)

        return
      }

      if (body.code === 403) {
        setErrors({
          email: 'Your account is not active.',
        })
        setSubmitting(false)

        return
      }
    }

    await logIn(body.data.sessionToken, body.data.refreshToken)
  }

  return (
    <Modal>
      <Title>
        {intl.formatMessage({
          defaultMessage: 'Log In',
          description: '[Login Modal] Modal title.',
          id: 'wHB27C',
        })}
      </Title>

      <Form
        autoComplete
        initialValues={formInitialValues}
        onSubmit={getSessionJwtAndLogIn}
        validationSchema={FormSchema}
      >
        <Field>
          <Form.Input
            autoComplete="email"
            label={intl.formatMessage({
              defaultMessage: 'Email',
              description: '[Login Modal] Form email input label.',
              id: 'ugMu4J',
            })}
            name="email"
            type="email"
          />
        </Field>
        <Field>
          <Form.Input
            autoComplete="current-password"
            label={intl.formatMessage({
              defaultMessage: 'Password',
              description: '[Login Modal] Form password input label.',
              id: 'xhJCpr',
            })}
            name="password"
            type="password"
          />
        </Field>

        <Field>
          <Form.Submit>
            {intl.formatMessage({
              defaultMessage: 'Log In',
              description: '[Login Modal] Form submit button label.',
              id: 'I8y4ic',
            })}
          </Form.Submit>
        </Field>
      </Form>
    </Modal>
  )
}
