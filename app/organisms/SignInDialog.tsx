import { Dialog, Field } from '@singularity/core'
import { NexauthError, useAuth } from 'nexauth/client'
import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'
import zxcvbn from 'zxcvbn'

import { handleError } from '../../common/helpers/handleError'
import { ButtonAsLink } from '../atoms/ButtonAsLink'
import { Form } from '../molecules/Form'

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

enum SignInDialogType {
  LOG_IN = 'LOG_IN',
  SIGN_UP = 'SIGN_UP',
}

const ERROR_PATH = 'app/organisms/<SignInDialog />'

export function SignInDialog() {
  const [passwordHelperText, setPasswordHelperText] = useState<Common.Nullable<string>>(null)
  const [type, setType] = useState(SignInDialogType.LOG_IN)
  const auth = useAuth<Common.Auth.User>()
  const intl = useIntl()

  const logInFormSchema = useMemo(
    () =>
      Yup.object().shape({
        logInEmail: Yup.string()
          .required(
            intl.formatMessage({
              defaultMessage: 'Please enter your email.',
              description: '[Login Dialog] Email input requirement error.',
              id: 'LOGIN_DIALOG__EMAIL_INPUT_REQUIREMENT_ERROR',
            }),
          )
          .email(
            intl.formatMessage({
              defaultMessage: "Your email doesn't look right.",
              description: '[Login Dialog] Email input format error.',
              id: 'LOGIN_DIALOG__EMAIL_INPUT_FORMAT_ERROR',
            }),
          ),
        logInPassword: Yup.string().required(
          intl.formatMessage({
            defaultMessage: 'Please enter your password.',
            description: '[Login Dialog] Password input requirement error.',
            id: 'LOGIN_DIALOG__PASSWORD_INPUT_REQUIREMENT_ERROR',
          }),
        ),
      }),
    [],
  )

  const signUpFormSchema = useMemo(
    () =>
      Yup.object().shape({
        signUpEmail: Yup.string()
          .required(
            intl.formatMessage({
              defaultMessage: 'Please enter your email.',
              description: '[Signup Dialog] Email input requirement error.',
              id: 'SIGNUP_DIALOG__EMAIL_INPUT_REQUIREMENT_ERROR',
            }),
          )
          .email(
            intl.formatMessage({
              defaultMessage: "Your email doesn't look right.",
              description: '[Signup Dialog] Email input format error.',
              id: 'SIGNUP_DIALOG__EMAIL_INPUT_FORMAT_ERROR',
            }),
          ),
        signUpPassword: Yup.string().required(
          intl.formatMessage({
            defaultMessage: 'Please enter your password.',
            description: '[Signup Dialog] Password input requirement error.',
            id: 'SIGNUP_DIALOG__PASSWORD_INPUT_REQUIREMENT_ERROR',
          }),
        ),
        signUpPasswordConfirmation: Yup.string()
          .required(
            intl.formatMessage({
              defaultMessage: 'Please enter your password.',
              description: '[Signup Dialog] Password confirmation input requirement error.',
              id: 'SIGNUP_DIALOG__PASSWORD_CONFIRMATION_INPUT_REQUIREMENT_ERROR',
            }),
          )
          .oneOf(
            [Yup.ref('signUpPassword')],
            intl.formatMessage({
              defaultMessage: "Passwords don't match.",
              description: '[Signup Dialog] Password confirmation input match error.',
              id: 'SIGNUP_DIALOG__PASSWORD_CONFIRMATION_INPUT_MATCH_ERROR',
            }),
          ),
      }),
    [],
  )

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
                logInEmail: intl.formatMessage({
                  defaultMessage: 'Wrong email and/or password.',
                  description: '[Login Dialog] Wrong creadentials error.',
                  id: 'LOGIN_DIALOG__WRONG_CREDENTIALS_ERROR',
                }),
              })
              break

            case NexauthError.LOG_IN_UNACCEPTABLE_CONDITION:
              setErrors({
                logInEmail: intl.formatMessage({
                  defaultMessage: 'Your account has not yet been activated.',
                  description: '[Login Dialog] Disabled account error.',
                  id: 'LOGIN_DIALOG__DISABLED_ACCOUNT_ERROR',
                }),
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
      handleError(err, ERROR_PATH)
    }
  }

  const signUp = async (values: SignUpValues, { setErrors, setSubmitting }: FormikHelpers<SignUpValues>) => {
    try {
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
                signUpEmail: intl.formatMessage({
                  defaultMessage: 'This email is already associated with an existing account.',
                  description: '[Signup Dialog] Duplicate account error.',
                  id: 'SIGNUP_DIALOG__DUPLICATE_ACCOUNT_ERROR',
                }),
              })
              break

            default:
              setErrors({
                signUpEmail: JSON.stringify(res.error),
              })
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

      handleError(res, ERROR_PATH)

      switchToLogIn()
    } catch (err) {
      handleError(err, ERROR_PATH)
    }
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
                description: '[Login Dialog] Modal title.',
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
              <Form.TextInput
                autoComplete="email"
                label={intl.formatMessage({
                  defaultMessage: 'Email',
                  description: '[Login Dialog] Form email input label.',
                  id: 'ugMu4J',
                })}
                name="logInEmail"
                type="email"
              />
            </Field>
            <Field>
              <Form.TextInput
                autoComplete="current-password"
                label={intl.formatMessage({
                  defaultMessage: 'Password',
                  description: '[Login Dialog] Form password input label.',
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
                description: '[Login Dialog] Form submit button label.',
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
              description: '[Signup Dialog] Title.',
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
            <Form.TextInput
              autoComplete="email"
              label={intl.formatMessage({
                defaultMessage: 'Your email',
                description: '[Signup Dialog] Email input label.',
                id: 'YJ9OxG',
              })}
              name="signUpEmail"
              type="email"
            />
          </Field>
          <Field>
            <Form.TextInput
              autoComplete="new-password"
              helper={passwordHelperText || undefined}
              label={intl.formatMessage({
                defaultMessage: 'A new password',
                description: '[Signup Dialog] Password input label.',
                id: 'fWOJDC',
              })}
              name="signUpPassword"
              onChange={checkPasswordStrength}
              type="password"
            />
          </Field>
          <Field>
            <Form.TextInput
              autoComplete="new-password"
              label={intl.formatMessage({
                defaultMessage: 'Your new password (again)',
                description: '[Signup Dialog] Password repeat input label.',
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
              description: '[Signup Dialog] Submit button label.',
              id: 'q5x9RM',
            })}
          </Form.Submit>
        </Dialog.Action>
      </Form>
    </Dialog>
  )
}
