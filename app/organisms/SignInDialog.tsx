import { Dialog, Field } from '@singularity/core'
import { NexauthError, useAuth } from 'nexauth/client'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'
import zxcvbn from 'zxcvbn'

import { handleError } from '../../common/helpers/handleError'
import { ButtonAsLink } from '../atoms/ButtonAsLink'
import Form from '../molecules/Form'

import type { FormikHelpers } from 'formik'
import type { ChangeEvent } from 'react'

type LogInValues = {
  logInEmail: string
  logInPassword: string
}

type SignUpValues = {
  signUpEmail: string
  signUpPassword: string
  signUpPasswordConfirmation: string
}

export enum SignInDialogType {
  LOG_IN = 'LOG_IN',
  SIGN_UP = 'SIGN_UP',
}

const logInFormSchema = Yup.object().shape({
  logInEmail: Yup.string().required(`Veuillez entrer votre email.`).email(`Votre addresse email est mal formatée.`),
  logInPassword: Yup.string().required(`Veuillez entrer votre mot de passe.`),
})

const signUpFormSchema = Yup.object().shape({
  signUpEmail: Yup.string().required(`Veuillez entrer votre email.`).email(`Votre addresse email est mal formatée.`),
  signUpPassword: Yup.string().required(`Veuillez entrer un mot de passe.`),
  signUpPasswordConfirmation: Yup.string()
    .required(`Veuillez répéter le mot de passe.`)
    .oneOf([Yup.ref('signUpPassword'), null], 'Les mots de passe ne correspondent pas.'),
})

type SignInDialogProps = {
  defaultType?: SignInDialogType
}
export function SignInDialog({ defaultType = SignInDialogType.LOG_IN }: SignInDialogProps) {
  const [passwordHelperText, setPasswordHelperText] = useState<Common.Nullable<string>>(null)
  const [type, setType] = useState(defaultType)
  const auth = useAuth<Common.Auth.User>()
  const intl = useIntl()

  const checkPasswordStrength = (event: ChangeEvent<HTMLInputElement>): void => {
    const password = event.currentTarget.value

    if (password.length === 0) {
      setPasswordHelperText(null)

      return
    }

    const result = zxcvbn(password)
    const timeToHack = result.crack_times_display.offline_slow_hashing_1e4_per_second

    const helperText = `It would take ${timeToHack} to hack this password.`

    setPasswordHelperText(helperText)
  }

  const logIn = async (values: LogInValues, { setErrors, setSubmitting }: FormikHelpers<LogInValues>) => {
    try {
      const { logInEmail, logInPassword } = values

      const res = await auth.logIn(logInEmail, logInPassword)
      if (res.isError) {
        if (res.error.email !== undefined) {
          switch (res.error.email) {
            case NexauthError.LOG_IN_WRONG_EMAIL_OR_PASSWORD:
              setErrors({
                logInEmail: 'Mauvais email et/ou mot de passe.',
              })
              break

            case NexauthError.LOG_IN_UNACCEPTABLE_CONDITION:
              setErrors({
                logInEmail: 'Votre compte n’a pas encore été activé.',
              })
              break

            default:
              // eslint-disable-next-line no-console
              console.error(res.error)
          }
        }

        setSubmitting(false)
      }
    } catch (err) {
      handleError(err, 'pages/admin/signin.js:validateForm()')
    }
  }

  const signUp = async (values: SignUpValues, { setErrors, setSubmitting }: FormikHelpers<SignUpValues>) => {
    const { signUpEmail: email, signUpPassword: password } = values

    const res = await auth.signUp({
      email: email.trim().toLocaleLowerCase(),
      password,
    })
    if (res.isError) {
      if (res.error.email !== undefined) {
        switch (res.error.email) {
          case NexauthError.SIGN_UP_DUPLICATE_EMAIL:
            setErrors({
              signUpEmail: 'Cette adresse email est déjà associée à un compte.',
            })
            break

          default:
            // eslint-disable-next-line no-console
            console.error(res.error)
        }
      } else {
        // eslint-disable-next-line no-console
        console.error(res.error)
      }

      setSubmitting(false)

      return
    }

    switchToLogIn()
  }

  const switchToLogIn = () => {
    setType(SignInDialogType.LOG_IN)
  }

  const switchToSignUp = () => {
    setType(SignInDialogType.SIGN_UP)
  }

  if (type === SignInDialogType.LOG_IN) {
    return (
      <Dialog>
        <Form
          key="logIn.form"
          autoComplete="on"
          initialValues={{}}
          onSubmit={logIn as any}
          validationSchema={logInFormSchema}
        >
          <Dialog.Body>
            <Dialog.Title>
              {intl.formatMessage({
                defaultMessage: 'Log In',
                description: '[Login Modal] Modal title.',
                id: 'wHB27C',
              })}
            </Dialog.Title>
            <p>
              Please{' '}
              <ButtonAsLink onClick={switchToSignUp} type="button">
                sign up
              </ButtonAsLink>{' '}
              if you don’t have an account.
            </p>

            <Field>
              <Form.Input
                autoComplete="email"
                label={intl.formatMessage({
                  defaultMessage: 'Email',
                  description: '[Login Modal] Form email input label.',
                  id: 'ugMu4J',
                })}
                name="logInEmail"
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
                name="logInPassword"
                type="password"
              />
            </Field>
          </Dialog.Body>

          <Dialog.Action>
            <Form.Submit>
              {intl.formatMessage({
                defaultMessage: 'Log In',
                description: '[Login Modal] Form submit button label.',
                id: 'I8y4ic',
              })}
            </Form.Submit>
          </Dialog.Action>
        </Form>
      </Dialog>
    )
  }

  return (
    <Dialog>
      <Form
        key="signUp.form"
        autoComplete="on"
        initialValues={{}}
        onSubmit={signUp as any}
        validationSchema={signUpFormSchema}
      >
        <Dialog.Body>
          <Dialog.Title>
            {intl.formatMessage({
              defaultMessage: 'Sign Up',
              description: '[Signup Modal] Title.',
              id: 'EYeJTo',
            })}
          </Dialog.Title>
          <p>
            Please{' '}
            <ButtonAsLink onClick={switchToLogIn} type="button">
              log in
            </ButtonAsLink>{' '}
            if you already have an account.
          </p>

          <Field>
            <Form.Input
              autoComplete="email"
              label={intl.formatMessage({
                defaultMessage: 'Your email',
                description: '[Signup Modal] Email input label.',
                id: 'YJ9OxG',
              })}
              name="signUpEmail"
              type="email"
            />
          </Field>
          <Field>
            <Form.Input
              autoComplete="new-password"
              helper={passwordHelperText}
              label={intl.formatMessage({
                defaultMessage: 'A new password',
                description: '[Signup Modal] Password input label.',
                id: 'fWOJDC',
              })}
              name="signUpPassword"
              onChange={checkPasswordStrength}
              type="password"
            />
          </Field>
          <Field>
            <Form.Input
              autoComplete="new-password"
              label={intl.formatMessage({
                defaultMessage: 'Your new password (again)',
                description: '[Signup Modal] Password repeat input label.',
                id: 'K06DbM',
              })}
              name="signUpPasswordConfirmation"
              type="password"
            />
          </Field>
        </Dialog.Body>

        <Dialog.Action>
          <Form.Submit>
            {intl.formatMessage({
              defaultMessage: 'Sign Up',
              description: '[Signup Modal] Submit button label.',
              id: 'q5x9RM',
            })}
          </Form.Submit>
        </Dialog.Action>
      </Form>
    </Dialog>
  )
}
