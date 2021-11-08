/* eslint-disable react/prop-types */

import { styled } from '@singularity-ui/core'
import { FormikContextType, useFormikContext } from 'formik'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

import { SURVEY_BLOCK_TYPE } from '../../common/constants'
import SurveyHeader from '../atoms/SurveyHeader'
import SurveyLogo from '../atoms/SurveyLogo'
import SurveyParagraph from '../atoms/SurveyParagraph'
import SurveyQuestion from '../atoms/SurveyQuestion'
import SurveyTitle from '../atoms/SurveyTitle'
import useApi from '../hooks/useApi'
import SurveyManager from '../libs/SurveyManager'
import Block from '../libs/SurveyManager/Block'
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

const Row = styled.div`
  display: flex;
`

const Asterisk = styled.div`
  align-items: center;
  color: black;
  display: flex;
  font-size: 125%;
  font-weight: 700;
  justify-content: center;
  min-height: 3rem;
  padding-left: 0.5rem;
`

const Error = styled.p`
  color: ${p => p.theme.color.danger.active};
  font-weight: 700;
  padding-bottom: 0.5rem;
`

const SURVEY_BLOCK_TYPE_COMPONENT = {
  [SURVEY_BLOCK_TYPE.CONTENT.QUESTION]: SurveyQuestion,
  [SURVEY_BLOCK_TYPE.CONTENT.TEXT]: SurveyParagraph,
  [SURVEY_BLOCK_TYPE.INPUT.CHECKBOX]: SurveyForm.Checkbox,
  [SURVEY_BLOCK_TYPE.INPUT.CHOICE]: SurveyForm.Radio,
  [SURVEY_BLOCK_TYPE.INPUT.LONG_ANSWER]: SurveyForm.Textarea,
  [SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER]: SurveyForm.TextInput,
}

const buildValidationSchema = (blocks, message) =>
  blocks.reduce((schema, block) => {
    if (!block.isQuestion || !block.isMandatory) {
      return schema
    }

    return {
      ...schema,
      [block._id]: Yup.string().required(message),
    }
  }, {})

const renderBlocks = (formikContext: FormikContextType<any>, blocks: Block[]) => {
  const { errors, submitCount, values } = formikContext

  let indexableBlockIndex: Common.Nullable<number> = null
  let isHidden: boolean = false
  let questionId: Common.Nullable<string> = null

  return blocks.reduce((components, block, index) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id, countLetter, type, value } = block

    if (block.isQuestion) {
      questionId = _id

      if (block.isHidden) {
        const maybeConditioningInputBlocks = R.filter(R.propEq('ifSelectedThenShowQuestionId', block._id))(
          blocks,
        ) as any[]
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
    } else if (type === lastBlock?.type && indexableBlockIndex !== null) {
      indexableBlockIndex += 1
    } else {
      indexableBlockIndex = 0
    }

    const innerHTML = { __html: value }
    const label = String(value)

    const newComponent = block.isInput ? (
      <Component
        key={_id}
        countLetter={countLetter}
        index={indexableBlockIndex}
        label={label}
        name={questionId}
        value={label}
      />
    ) : (
      <Row key={_id}>
        <Component dangerouslySetInnerHTML={innerHTML} />

        {block.isMandatory && <Asterisk>*</Asterisk>}
      </Row>
    )

    if (submitCount === 0 || !errors[_id]) {
      return [...components, newComponent]
    }

    return [...components, newComponent, <Error key={`${_id}.error`}>{errors[_id]}</Error>]
  }, [])
}

const SurveyBlocks = ({ blocks }) => {
  const formikContext = useFormikContext()

  return <>{renderBlocks(formikContext, blocks)}</>
}

export default function PublicSurvey({ data }) {
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState({})
  const [isSent, setIsSent] = useState(false)
  const intl = useIntl()
  const api = useApi()

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { _id, blocks, title } = data
  const surveyManager = new SurveyManager(blocks)
  const surveySessionKey = `survey-${_id}`

  const validationMessage = intl.formatMessage({
    defaultMessage: 'This answer is required to validate the form:',
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
          <SurveyQuestion>
            {intl.formatMessage({
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
