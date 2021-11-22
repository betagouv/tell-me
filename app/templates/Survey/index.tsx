/* eslint-disable react/prop-types */

import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import * as Yup from 'yup'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import SurveyHeader from '../../atoms/SurveyHeader'
import SurveyLogo from '../../atoms/SurveyLogo'
import SurveyQuestion from '../../atoms/SurveyQuestion'
import SurveyTitle from '../../atoms/SurveyTitle'
import useApi from '../../hooks/useApi'
import SurveyManager from '../../libs/SurveyManager'
import Block from '../../libs/SurveyManager/Block'
import Loader from '../../molecules/Loader'
import SurveyForm from '../../molecules/SurveyForm'
import Blocks from './Blocks'

const Page = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding-bottom: 5rem;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 960px;
`

const buildValidationSchema = (blocks: Block[], message: string) =>
  blocks.reduce((schema, block) => {
    if (!block.isQuestion || !block.isMandatory) {
      return schema
    }

    if (block.questionInputType === SURVEY_BLOCK_TYPE.INPUT.CHECKBOX) {
      return {
        ...schema,
        [block._id]: Yup.array(Yup.string()).required(message),
      }
    }

    if (block.questionInputType === SURVEY_BLOCK_TYPE.INPUT.FILE) {
      return {
        ...schema,
        [block._id]: Yup.object()
          .shape({
            name: Yup.string().required(message),
          })
          .nullable(),
      }
    }

    return {
      ...schema,
      [block._id]: Yup.string().required(message),
    }
  }, {})

export default function PublicSurvey({ data: survey }) {
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState({})
  const [isSent, setIsSent] = useState(false)
  const intl = useIntl()
  const api = useApi()

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const surveyManager = new SurveyManager(survey.blocks)
  const surveySessionKey = `survey-${survey._id}`

  const validationMessage = intl.formatMessage({
    defaultMessage: 'This answer is required to validate the form.',
    description: '[Public Survey] Missing answer error message for a required question.',
    id: 'cvJp/S',
  })
  const validationSchema = buildValidationSchema(surveyManager.blocks, validationMessage)
  const FormSchema = Yup.object().shape(validationSchema)

  const loadFormDataFromSession = () => {
    const maybeValuesJson = window.sessionStorage.getItem(surveySessionKey)
    if (maybeValuesJson === null) {
      setIsLoading(false)

      return
    }

    const values = JSON.parse(maybeValuesJson)

    setInitialValues(values)
    setIsLoading(false)
  }

  const saveFormDataToSession = values => {
    const valuesJson = JSON.stringify(values)

    window.sessionStorage.setItem(surveySessionKey, valuesJson)
  }

  const clearFormDataFromSession = () => {
    window.sessionStorage.removeItem(surveySessionKey)
  }

  const submitSurvey = async (values, { setSubmitting }) => {
    const surveyEntryAnswers = surveyManager.conciliateFormData(values)

    const isFileInput = R.propEq('type', SURVEY_BLOCK_TYPE.INPUT.FILE)
    const nonFileAnswers = R.reject(isFileInput)(surveyEntryAnswers)
    const fileAnswers = R.filter(isFileInput)(surveyEntryAnswers)

    const surveyEntry = {
      answers: nonFileAnswers,
      survey: survey._id,
    }

    const maybeBody = await api.post('survey/entry', surveyEntry)
    if (maybeBody === null || maybeBody.hasError) {
      setSubmitting(false)

      return
    }

    const {
      data: { _id: surveyEntryId },
    } = maybeBody

    await Promise.all(
      fileAnswers.map(async fileAnswer => {
        const {
          question,
          type,
          values: [file],
        } = fileAnswer

        const formData = new FormData()
        formData.append('file', file)

        await api.put(`survey/entry-upload?surveyEntryId=${surveyEntryId}&type=${type}&question=${question}`, formData)
      }),
    )

    clearFormDataFromSession()
    setIsSent(true)
  }

  useEffect(() => {
    loadFormDataFromSession()
  }, [])

  return (
    <Page>
      <SurveyHeader url={survey.props.coverUrl} />

      <Container>
        <SurveyLogo url={survey.props.logoUrl} />

        <SurveyTitle>{survey.title}</SurveyTitle>

        {isLoading && <Loader />}

        {!isLoading && !isSent && (
          <SurveyForm
            initialValues={initialValues}
            onChange={saveFormDataToSession}
            onSubmit={submitSurvey}
            validationSchema={FormSchema}
          >
            <Blocks blocks={surveyManager.blocks} />

            <SurveyForm.Submit>
              {intl.formatMessage({
                defaultMessage: 'Submit',
                description: '[Public Survey] Submit button label.',
                id: 'i0E602',
              })}
            </SurveyForm.Submit>
          </SurveyForm>
        )}

        {!isLoading && isSent && (
          <SurveyQuestion>
            {survey.props.thankYouMessage && survey.props.thankYouMessage.length > 0
              ? survey.props.thankYouMessage
              : intl.formatMessage({
                  defaultMessage: 'Thank you for your interest in helping our project!',
                  description: '[Public Survey] Thank you message once the survey has been sent.',
                  id: 'i8B3g5',
                })}
          </SurveyQuestion>
        )}
      </Container>
    </Page>
  )
}
