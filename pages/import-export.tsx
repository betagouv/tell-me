import { AdminHeader } from '@app/atoms/AdminHeader'
import { CardTitle } from '@app/atoms/CardTitle'
import { Title } from '@app/atoms/Title'
import { useApi } from '@app/hooks/useApi'
import { Form } from '@app/molecules/Form'
import { AdminBox } from '@app/organisms/AdminBox'
import { handleError } from '@common/helpers/handleError'
import { Card, Field } from '@singularity/core'
import ky from 'ky'
import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

import type { SurveyWithJsonType } from '@common/types'

const ERROR_PATH = 'pages/import-export.tsx'

export default function ImportExportPage() {
  const api = useApi()
  const intl = useIntl()

  const viaApiSurveysImportFormSchema = useMemo(
    () =>
      Yup.object().shape({
        viaApiSurveysImportPersonalAccessToken: Yup.string().required(
          intl.formatMessage({
            defaultMessage:
              'Please generate a Personal Access Token on the remote Tell Me source and copy/paste its value here.',
            description: '[Import Surveys via API Form] Password input requirement error.',
            id: 'IMPORT_SURVEYS_VIA_API_FORM__PAT_INPUT_REQUIREMENT_ERROR',
          }),
        ),
        viaApiSurveysImportUrl: Yup.string()
          .required(
            intl.formatMessage({
              defaultMessage: 'Please enter the Tell Me remote source url.',
              description: '[Import Surveys via API Form] Url input requirement error.',
              id: 'IMPORT_SURVEYS_VIA_API_FORM__URL_INPUT_REQUIREMENT_ERROR',
            }),
          )
          .url(
            intl.formatMessage({
              defaultMessage: "This URL format doesn't look right.",
              description: '[Import Surveys via API Form] Url input format error.',
              id: 'IMPORT_SURVEYS_VIA_API_FORM__URL_INPUT_FORMAT_ERROR',
            }),
          ),
      }),
    [],
  )

  const importSurveysViaApi = useCallback(async (values, { setSubmitting }) => {
    try {
      const sourceUrl = `${values.viaApiSurveysImportUrl}/api/surveys`
        .replace(/\/{2}api/, '/api')
        .replace(/(\/api){2}/, '/api')

      const sourceResponse = ky.get(sourceUrl, {
        mode: 'cors',
        searchParams: {
          personalAccessToken: values.viaApiSurveysImportPersonalAccessToken,
        },
      })
      const sourceData = await sourceResponse.json<Api.ResponseBody<SurveyWithJsonType[]>>()
      if (sourceData.hasError) {
        setSubmitting(false)

        return
      }

      const sourceSurveys = sourceData.data

      await Promise.all(
        sourceSurveys.map(async sourceSurvey => {
          const maybeBody = await api.get<SurveyWithJsonType>(`surveys/${sourceSurvey.id}`)
          if (maybeBody === null || !maybeBody.hasError || maybeBody.code !== 404) {
            return
          }

          await api.post(`surveys`, sourceSurvey)
        }),
      )
    } catch (err) {
      handleError(err, ERROR_PATH)
    } finally {
      setSubmitting(false)
    }
  }, [])

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'Import / Export',
            description: '[Import / Export Page] Title.',
            id: 'IMPORT_EXPORT_PAGE__TITLE',
          })}
        </Title>
      </AdminHeader>

      <Card>
        <CardTitle isFirst>Import Surveys via Tell Me API</CardTitle>
        <p>
          {intl.formatMessage({
            defaultMessage: 'You can import surveys between different Tell Me instances using their API.',
            description: '[Import Surveys via API Form] Description.',
            id: 'IMPORT_SURVEYS_VIA_API_FORM__DESCRIPTION',
          })}
        </p>
        <p>
          <em>
            {intl.formatMessage({
              defaultMessage:
                'You first have to generate a Personal Access Token on the source instance in order for the current instance to have access to the remote data.',
              description: '[Import Surveys via API Form] Description helper.',
              id: 'IMPORT_SURVEYS_VIA_API_FORM__DESCRIPTION_HELPER',
            })}
          </em>{' '}
        </p>

        <Form
          initialValues={{}}
          onSubmit={importSurveysViaApi}
          validationSchema={viaApiSurveysImportFormSchema}
          withTopMargin
        >
          <Field>
            <Form.TextInput
              label={intl.formatMessage({
                defaultMessage: 'URL',
                description: '[Import Surveys via API Form] URL input label.',
                id: 'IMPORT_SURVEYS_VIA_API_FORM__URL_INPUT_LABEL',
              })}
              name="viaApiSurveysImportUrl"
            />
          </Field>

          <Field>
            <Form.TextInput
              label={intl.formatMessage({
                defaultMessage: 'Personal Access Token',
                description: '[Import Surveys via API Form] Personal Access Token input label.',
                id: 'IMPORT_SURVEYS_VIA_API_FORM__PAT_INPUT_LABEL',
              })}
              name="viaApiSurveysImportPersonalAccessToken"
            />
          </Field>

          <Field>
            <Form.Submit>
              {intl.formatMessage({
                defaultMessage: 'Import Surveys',
                description: '[Import Surveys via API Form] Form import button label.',
                id: 'IMPORT_SURVEYS_VIA_API_FORM__IMPORT_BUTTON_LABEL',
              })}
            </Form.Submit>
          </Field>
        </Form>
      </Card>
    </AdminBox>
  )
}
