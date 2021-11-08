import PropTypes from 'prop-types'
import { ChangeEvent, useEffect, useState } from 'react'
import * as Yup from 'yup'
import zxcvbn from 'zxcvbn'

import Title from '../atoms/Title'
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

export default function SignupModal({ onDone }) {
  const [passwordHelperText, setPasswordHelperText] = useState(' ')
  const api = useApi()

  useEffect(() => {
    window.localStorage.clear()
  }, [])

  const checkPasswordStrength = (event: ChangeEvent<HTMLInputElement>): void => {
    const password = event.currentTarget.value

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
      <Title>User Signup</Title>

      <Form autoComplete onSubmit={confirmPasswordAndSignup} validate={validateForm} validationSchema={FormSchema}>
        <Form.Input autoComplete="email" label="Your email" name="email" type="email" />
        <Form.Input
          autoComplete="new-password"
          helper={passwordHelperText}
          label="A new password"
          name="password"
          onChange={checkPasswordStrength}
          type="password"
        />
        <Form.Input
          autoComplete="new-password"
          label="Your new password (again)"
          name="passwordConfirmation"
          type="password"
        />

        <Form.Submit>Create</Form.Submit>
      </Form>
    </Modal>
  )
}

SignupModal.propTypes = {
  onDone: PropTypes.func.isRequired,
}
