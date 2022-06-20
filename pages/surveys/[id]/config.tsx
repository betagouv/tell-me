import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { useApi } from '@app/hooks/useApi'
import { useIsMounted } from '@app/hooks/useIsMounted'
import { Form } from '@app/molecules/Form'
import { Loader } from '@app/molecules/Loader'
import { AdminBox } from '@app/organisms/AdminBox'
import { Card, Field } from '@singularity/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

import type { SurveyWithJsonType } from '@common/types'
import type { TellMe } from '@schemas/1.0.0/TellMe'

type FormValues = {
  isPublished: SurveyWithJsonType['isPublished']
  slug: SurveyWithJsonType['slug']
  thankYouMessage: TellMe.Tree['data']['thankYouMessage']
  title: TellMe.Tree['data']['title']
}

export default function SurveyConfigPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<FormValues | {}>({})
  const api = useApi()
  const intl = useIntl()
  const isMounted = useIsMounted()
  const router = useRouter()

  const { id } = router.query

  const FormSchema = Yup.object().shape({
    slug: Yup.string().required(`Slug is mandatory.`),
  })

  const loadSurvey = async () => {
    const maybeBody = await api.get<SurveyWithJsonType>(`surveys/${id}`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const {
      isPublished,
      slug,
      tree: {
        data: { thankYouMessage, title },
      },
    } = maybeBody.data

    const surveyConfigurableData = {
      isPublished,
      slug,
      thankYouMessage,
      title,
    }

    if (isMounted()) {
      setInitialValues(surveyConfigurableData)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSurvey()
  }, [])

  const updateSurveyAndGoBack = async (values: any, { setErrors, setSubmitting }) => {
    const { isPublished, slug, thankYouMessage, title } = values as FormValues
    const maybeGetBody = await api.get<SurveyWithJsonType>(`surveys/${id}`)
    if (maybeGetBody === null || maybeGetBody.hasError) {
      return
    }

    const normalizedThankYouMessage =
      typeof thankYouMessage === 'string' && thankYouMessage.trim().length > 0 ? thankYouMessage.trim() : null
    const tree: TellMe.Tree = {
      ...maybeGetBody.data.tree,
      data: {
        ...maybeGetBody.data.tree.data,
        thankYouMessage: normalizedThankYouMessage,
        title,
      },
    }

    const udpatedData: Pick<SurveyWithJsonType, 'isPublished' | 'slug' | 'tree'> = {
      isPublished,
      slug,
      tree,
    }

    const maybePostBody = await api.patch(`surveys/${id}`, udpatedData)
    if (maybePostBody === null || maybePostBody.hasError) {
      setErrors({
        title: 'Sorry, but something went wrong.',
      })
      setSubmitting(false)

      return
    }

    router.push('/surveys')
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'Survey Config',
            description: '[Survey Config] Page title.',
            id: 'YbP4R+',
          })}
        </Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues} onSubmit={updateSurveyAndGoBack} validationSchema={FormSchema}>
          <Form.TextInput
            label={intl.formatMessage({
              defaultMessage: 'Title',
              description: '[Survey Config] Form title input label.',
              id: 'pglohm',
            })}
            name="title"
          />

          <Field>
            <Form.TextInput
              label={intl.formatMessage({
                defaultMessage: 'Slug',
                description: '[Survey Config] Form slug input label.',
                id: 'N68/ff',
              })}
              name="slug"
            />
          </Field>

          <Field>
            <Form.Textarea
              label={intl.formatMessage({
                defaultMessage: 'Thank You message',
                description: '[Survey Config] Form thank you message textarea label.',
                id: 'E/vx8U',
              })}
              name="thankYouMessage"
              // eslint-disable-next-line formatjs/enforce-description, formatjs/enforce-default-message
              placeholder={intl.formatMessage({
                defaultMessage: 'Thank you for your interest in helping our project!',
                description: '[Survey Config] Form thank you message textarea placeholder.',
                id: 'vaW853',
              })}
            />
          </Field>

          <Field>
            <Form.Checkbox
              label={intl.formatMessage({
                defaultMessage: 'Published',
                description: '[Survey Config] Form published checkbox label.',
                id: 'YzeZvW',
              })}
              name="isPublished"
            />
          </Field>

          <Field>
            <Form.Submit>
              {intl.formatMessage({
                defaultMessage: 'Update',
                description: '[Survey Config] Form update button label.',
                id: 'bdTRI9',
              })}
            </Form.Submit>
          </Field>
        </Form>
      </Card>
    </AdminBox>
  )
}
