import AdminHeader from '@app/atoms/AdminHeader'
import Field from '@app/atoms/Field'
import Title from '@app/atoms/Title'
import useApi from '@app/hooks/useApi'
import useIsMounted from '@app/hooks/useIsMounted'
import Form from '@app/molecules/Form'
import { Loader } from '@app/molecules/Loader'
import { Card } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

export default function LegacySurveyConfigPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<any>(null)
  const api = useApi()
  const intl = useIntl()
  const isMounted = useIsMounted()
  const router = useRouter()

  const { id } = router.query

  const FormSchema = Yup.object().shape({
    slug: Yup.string().required(`Slug is mandatory.`),
  })

  const loadSurvey = async () => {
    const maybeBody = await api.get(`legacy/surveys/${id}`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const surveyData = maybeBody.data
    const surveyConfigurableData: any = R.pick(['isPublished', 'slug', 'title'])(surveyData)
    surveyConfigurableData.thankYouMessage = surveyData.props.thankYouMessage

    if (isMounted()) {
      setInitialValues(surveyConfigurableData)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSurvey()
  }, [])

  const updateSurveyAndGoBack = async (values, { setErrors, setSubmitting }) => {
    const surveyData: any = R.pick(['isPublished', 'slug', 'title'])(values)
    surveyData.props = R.pick(['thankYouMessage'])(values)

    const maybeBody = await api.patch(`legacy/surveys/${id}`, surveyData)
    if (maybeBody === null || maybeBody.hasError) {
      setErrors({
        title: 'Sorry, but something went wrong.',
      })
      setSubmitting(false)

      return
    }

    router.push('/legacy/surveys')
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'Survey Settings',
            description: '[Survey Settings] Page title.',
            id: 'YbP4R+',
          })}
        </Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues} onSubmit={updateSurveyAndGoBack} validationSchema={FormSchema}>
          <Form.Input
            label={intl.formatMessage({
              defaultMessage: 'Title',
              description: '[Survey Settings] Form title input label.',
              id: 'pglohm',
            })}
            name="title"
          />

          <Field>
            <Form.Input
              label={intl.formatMessage({
                defaultMessage: 'Slug',
                description: '[Survey Settings] Form slug input label.',
                id: 'N68/ff',
              })}
              name="slug"
            />
          </Field>

          <Field>
            <Form.Textarea
              label={intl.formatMessage({
                defaultMessage: 'Thank You message',
                description: '[Survey Settings] Form thank you message textarea label.',
                id: 'E/vx8U',
              })}
              name="thankYouMessage"
              // eslint-disable-next-line formatjs/enforce-description, formatjs/enforce-default-message
              placeholder={intl.formatMessage({
                defaultMessage: 'Thank you for your interest in helping our project!',
                description: '[Survey Settings] Form thank you message textarea placeholder.',
                id: 'vaW853',
              })}
            />
          </Field>

          <Field>
            <Form.Checkbox
              label={intl.formatMessage({
                defaultMessage: 'Published',
                description: '[Survey Settings] Form published checkbox label.',
                id: 'YzeZvW',
              })}
              name="isPublished"
            />
          </Field>

          <Field>
            <Form.Submit>
              {intl.formatMessage({
                defaultMessage: 'Update',
                description: '[Survey Settings] Form update button label.',
                id: 'bdTRI9',
              })}
            </Form.Submit>
          </Field>
        </Form>
      </Card>
    </>
  )
}
