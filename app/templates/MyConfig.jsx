import { Card } from '@singularity-ui/core'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

import { LOCALE_LABEL } from '../../common/constants'
import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Field from '../atoms/Field'
import Title from '../atoms/Title'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'
import useLocalization from '../hooks/useLocalization'
import Form from '../molecules/Form'

const FormSchema = Yup.object().shape({
  localeAsOption: Yup.object().required(`You must select a language.`),
})

const LOCALE_AS_OPTIONS = R.pipe(
  R.toPairs,
  R.map(([value, label]) => ({ label, value })),
)(LOCALE_LABEL)

export default function MyConfig() {
  const api = useApi()
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState(null)
  const intl = useIntl()
  const isMounted = useIsMounted()
  const localization = useLocalization()

  const loadMyConfig = async () => {
    const maybeBody = await api.get(`me`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const myConfigData = maybeBody.data
    const myEditableConfigData = {}
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
    const myConfigData = {}
    myConfigData.locale = values.localeAsOption.value

    const maybeBody = await api.patch(`me`, myConfigData)
    if (maybeBody === null || maybeBody.hasError) {
      setSubmitting(false)

      return
    }

    localization.refresh(myConfigData.locale)
  }

  if (isLoading) {
    return 'Loading...'
  }

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'My Settings',
            description: '[My Settings] Title.',
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
                description: '[My Settings] Form submit button label.',
                id: 'pLn6i2',
              })}
            </Form.Submit>
          </Field>
        </Form>
      </Card>
    </AdminBox>
  )
}
