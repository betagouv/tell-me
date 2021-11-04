/* eslint-disable react/prop-types */

import { styled } from '@singularity-ui/core'
import { useFormikContext } from 'formik'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

import { SURVEY_BLOCK_TYPE } from '../../common/constants'
import Paragraph from '../atoms/Paragraph'
import Question from '../atoms/Question'
import SurveyHeader from '../atoms/SurveyHeader'
import SurveyLogo from '../atoms/SurveyLogo'
import SurveyTitle from '../atoms/SurveyTitle'
import useApi from '../hooks/useApi'
import SurveyManager from '../libs/SurveyManager'
import Loader from '../molecules/Loader'
import SurveyForm from '../molecules/SurveyForm'
import isBlockTypeIndexable from './SurveyEditor/helpers/isBlockTypeIndexable'

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

const SURVEY_BLOCK_TYPE_COMPONENT = {
  [SURVEY_BLOCK_TYPE.CONTENT.QUESTION]: Question,
  [SURVEY_BLOCK_TYPE.CONTENT.TEXT]: Paragraph,
  [SURVEY_BLOCK_TYPE.INPUT.CHECKBOX]: SurveyForm.Checkbox,
  [SURVEY_BLOCK_TYPE.INPUT.CHOICE]: SurveyForm.Radio,
  [SURVEY_BLOCK_TYPE.INPUT.LONG_ANSWER]: SurveyForm.Textarea,
  [SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER]: SurveyForm.TextInput,
}

const FormSchema = Yup.object().shape({})

const isQuestion = R.pipe(R.prop('type'), R.equals(SURVEY_BLOCK_TYPE.CONTENT.QUESTION))
const isInput = R.pipe(R.prop('type'), R.startsWith('INPUT.'))

const renderBlocks = (blocks, values) => {
  let indexableBlockIndex = null
  let isHidden = false
  let questionId = null

  return blocks.reduce((components, block, index) => {
    const { _id, countLetter, type, value } = block

    if (isQuestion(block)) {
      questionId = _id

      if (block.isHidden) {
        const maybeConditioningInputBlocks = R.filter(R.propEq('ifSelectedThenShowQuestionId', block._id))(blocks)
        if (maybeConditioningInputBlocks.length === 0) {
          isHidden = true

          return components
        }

        const conditioningInputBlockValues = R.map(R.prop('value'))(maybeConditioningInputBlocks)
        const conditonalQuestionAnswerValueOrValues = values[maybeConditioningInputBlocks[0].questionId]

        if (
          typeof conditonalQuestionAnswerValueOrValues === 'string' &&
          R.includes(conditonalQuestionAnswerValueOrValues, conditioningInputBlockValues)
        ) {
          isHidden = false
        } else if (
          Array.isArray(conditonalQuestionAnswerValueOrValues) &&
          R.intersection(conditioningInputBlockValues, conditonalQuestionAnswerValueOrValues).length > 0
        ) {
          isHidden = false
        } else {
          isHidden = true
        }

        if (isHidden) {
          return components
        }
      } else {
        isHidden = false
      }
    } else if (isHidden) {
      return components
    }

    const Component = SURVEY_BLOCK_TYPE_COMPONENT[type]
    const isIndexable = isBlockTypeIndexable(type)
    const lastBlock = index > 0 ? blocks[index - 1] : null

    if (!isIndexable) {
      indexableBlockIndex = null
    } else if (type === lastBlock?.type) {
      indexableBlockIndex += 1
    } else {
      indexableBlockIndex = 0
    }

    const innerHTML = { __html: value }
    const label = String(value)

    const newComponent = isInput(block) ? (
      <Component
        key={_id}
        countLetter={countLetter}
        index={indexableBlockIndex}
        label={label}
        name={questionId}
        value={label}
      />
    ) : (
      <Component key={_id} dangerouslySetInnerHTML={innerHTML} />
    )

    return [...components, newComponent]
  }, [])
}

const SurveyBlocks = ({ blocks }) => {
  const { values } = useFormikContext()

  return renderBlocks(blocks, values)
}

export default function PublicSurvey({ data }) {
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState({})
  const [isSent, setIsSent] = useState(false)
  const intl = useIntl()
  const api = useApi()

  const { _id, blocks, title } = data
  const surveyManager = new SurveyManager(blocks)
  const surveySessionKey = `survey-${_id}`

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

  const submitSurvey = async values => {
    const surveyEntryAnswers = surveyManager.conciliateFormData(values)

    const surveyEntry = {
      answers: surveyEntryAnswers,
      survey: _id,
    }

    await api.post('survey/entry', surveyEntry)

    clearFormDataFromSession()
    setIsSent(true)
  }

  useEffect(() => {
    loadFormDataFromSession()
  }, [])

  return (
    <Page>
      <SurveyHeader surveyId={_id} />

      <Container>
        <SurveyLogo surveyId={_id} />

        <SurveyTitle>{title}</SurveyTitle>

        {isLoading && <Loader />}

        {!isLoading && !isSent && (
          <SurveyForm
            initialValues={initialValues}
            onChange={saveFormDataToSession}
            onSubmit={submitSurvey}
            validationSchema={FormSchema}
          >
            <SurveyBlocks blocks={surveyManager.blocks} />

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
          <Question>
            {intl.formatMessage({
              defaultMessage: 'Thank you for your interest in helping our project!',
              description: '[Public Survey] Thank you message once the survey has been sent.',
              id: 'i8B3g5',
            })}
          </Question>
        )}
      </Container>
    </Page>
  )
}
