import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'
import zxcvbn from 'zxcvbn'

import Field from '../atoms/Field.tsx'
import Title from '../atoms/Title.tsx'
import useApi from '../hooks/useApi'
import Form from '../molecules/Form'
import Modal from '../molecules/Modal'

const FormSchema = Yup.object().shape({
  email: Yup.string().required(`Please enter your email address.`).email(`This email doesn't look well formatted.`),
  password: Yup.string().required(`Please enter your password.`),
  passwordConfirmation: Yup.string().required(`Please confirm your password.`),
})

const validateForm = values => {
  if (values.password !== values.passwordConfirmation) {
    return {
      passwordConfirmation: `Your passwords don't match.`,
    }
  }

  return {}
}

export default function SetupModal({ onDone }) {
  const [passwordHelperText, setPasswordHelperText] = useState(' ')
  const intl = useIntl()
  const api = useApi()

  useEffect(() => {
    window.localStorage.clear()
  }, [])

  const checkPasswordStrength = event => {
    const password = event.target.value

    if (password.length === 0) {
      setPasswordHelperText(' ')

      return
    }

    const result = zxcvbn(password)
    const timeToHack = result.crack_times_display.offline_slow_hashing_1e4_per_second

    const helperText = `It would take ${timeToHack} to hack this password.`

    setPasswordHelperText(helperText)
  }

  const confirmPasswordAndSignup = async (values, { setErrors, setSubmitting }) => {
    const maybeBody = await api.post('auth/signup', values)
    if (maybeBody === null || maybeBody.hasError) {
      setErrors({
        email: 'Sorry, but something went wrong.',
      })
      setSubmitting(false)

      return
    }

    onDone()
  }

  return (
    <Modal>
      <Title>First User Setup</Title>

      <Form autoComplete onSubmit={confirmPasswordAndSignup} validate={validateForm} validationSchema={FormSchema}>
        <Field>
          <Form.Input
            autoComplete="email"
            label={intl.formatMessage({
              defaultMessage: 'Your email',
              description: '[Setup Modal] Email input label.',
              id: 'DPOyaV',
            })}
            name="email"
            type="email"
          />
        </Field>
        <Field>
          <Form.Input
            autoComplete="new-password"
            helperText={passwordHelperText}
            label={intl.formatMessage({
              defaultMessage: 'A new password',
              description: '[Setup Modal] Password input label.',
              id: 'A2n/eF',
            })}
            name="password"
            onChange={checkPasswordStrength}
            type="password"
          />
        </Field>
        <Field>
          <Form.Input
            autoComplete="new-password"
            label={intl.formatMessage({
              defaultMessage: 'Your new password (again)',
              description: '[Setup Modal] Password repeat input label.',
              id: 'hWoiIQ',
            })}
            name="passwordConfirmation"
            type="password"
          />
        </Field>

        <Field>
          <Form.Submit>
            {intl.formatMessage({
              defaultMessage: 'Create',
              description: '[Setup Modal] Submit button label.',
              id: 'Ci9rPk',
            })}
          </Form.Submit>
        </Field>
      </Form>
    </Modal>
  )
}

SetupModal.propTypes = {
  onDone: PropTypes.func.isRequired,
}
