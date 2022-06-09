import { AdminHeader } from '@app/atoms/AdminHeader'
import { Field } from '@app/atoms/Field'
import { Title } from '@app/atoms/Title'
import { useApi } from '@app/hooks/useApi'
import { useIsMounted } from '@app/hooks/useIsMounted'
import { useLocalization } from '@app/hooks/useLocalization'
import { Form } from '@app/molecules/Form'
import { Loader } from '@app/molecules/Loader'
import { LOCALE_LABEL } from '@common/constants'
import { Card } from '@singularity/core'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

const FormSchema = Yup.object().shape({
  localeAsOption: Yup.object().required(`You must select a language.`),
})

const LOCALE_AS_OPTIONS = R.pipe(
  R.toPairs,
  R.map(([value, label]: [string, string]) => ({ label, value })),
)(LOCALE_LABEL)

export default function MePage() {
  const api = useApi()
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState({})
  const intl = useIntl()
  const isMounted = useIsMounted()
  const localization = useLocalization()

  const loadMyConfig = async () => {
    const maybeBody = await api.get(`me`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const myConfigData = maybeBody.data
    const myEditableConfigData: any = {}
    myEditableConfigData.localeAsOption = {
      label: LOCALE_LABEL[myConfigData.locale],
      value: myConfigData.locale,
    }

    if (isMounted()) {
      setInitialValues(myEditableConfigData)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMyConfig()
  }, [])

  const updateUserAndGoBack = async (values, { setSubmitting }) => {
    const myConfigData: any = {}
    myConfigData.locale = values.localeAsOption.value

    const maybeBody = await api.patch(`me`, myConfigData)
    if (maybeBody === null || maybeBody.hasError) {
      setSubmitting(false)

      return
    }

    localization.refresh(myConfigData.locale)
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'My Settings',
            description: '[My Settings] Page title.',
            id: 'NNlf6B',
          })}
        </Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues} onSubmit={updateUserAndGoBack} validationSchema={FormSchema}>
          <Field>
            <Form.Select
              label={intl.formatMessage({
                defaultMessage: 'Language',
                description: '[My Settings] Form language select label.',
                id: 'lGHKue',
              })}
              name="localeAsOption"
              options={LOCALE_AS_OPTIONS}
            />
          </Field>

          <Field>
            <Form.Submit>
              {intl.formatMessage({
                defaultMessage: 'Update',
                description: '[My Settings] Form update button label.',
                id: 'pLn6i2',
              })}
            </Form.Submit>
          </Field>
        </Form>
      </Card>
    </>
  )
}
