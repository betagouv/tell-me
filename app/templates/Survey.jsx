/* eslint-disable react/prop-types */

import * as R from 'ramda'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import * as Yup from 'yup'

import { SURVEY_BLOCK_TYPE } from '../../common/constants'
import SurveyBlocksManager from '../../common/SurveyBlocksManager'
import Header from '../atoms/Header'
import Logo from '../atoms/Logo'
import Paragraph from '../atoms/Paragraph'
import Question from '../atoms/Question'
import Title from '../atoms/Title'
import useApi from '../hooks/useApi'
import SurveyForm from '../molecules/SurveyForm'
import isBlockTypeIndexable from './SurveyEditor/helpers/isBlockTypeIndexable'

const Page = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
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
  [SURVEY_BLOCK_TYPE.INPUT.CHECKBOX]: SurveyForm.CheckboxInput,
  [SURVEY_BLOCK_TYPE.INPUT.CHOICE]: SurveyForm.RadioInput,
  [SURVEY_BLOCK_TYPE.INPUT.LONG_ANSWER]: SurveyForm.Textarea,
  [SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER]: SurveyForm.TextInput,
}

const FormSchema = Yup.object().shape({})

const isQuestion = R.pipe(R.prop('type'), R.equals(SURVEY_BLOCK_TYPE.CONTENT.QUESTION))
const isInput = R.pipe(R.prop('type'), R.startsWith('INPUT.'))

const renderBlocks = blocks => {
  let indexableBlockIndex = null
  let questionId = null

  return blocks.reduce((components, block, index) => {
    const { countLetter, id, type, value } = block
    const Component = SURVEY_BLOCK_TYPE_COMPONENT[type]
    const isIndexable = isBlockTypeIndexable(type)
    const lastBlock = index > 0 ? blocks[index - 1] : null

    if (isQuestion(block)) {
      questionId = id
    }

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
        key={id}
        countLetter={countLetter}
        index={indexableBlockIndex}
        label={label}
        name={questionId}
        value={label}
      />
    ) : (
      <Component key={id} dangerouslySetInnerHTML={innerHTML} />
    )

    return [...components, newComponent]
  }, [])
}

export default function PublicSurvey({ data }) {
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState({})
  const [isSent, setIsSent] = useState(false)
  const api = useApi()

  const { _id: id, blocks, title } = data
  const surveyBlocksManager = new SurveyBlocksManager(blocks)
  const surveySessionKey = `survey-${id}`

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
    const surveyEntryAnswers = surveyBlocksManager.conciliateFormData(values)

    const surveyEntry = {
      answers: surveyEntryAnswers,
      survey: id,
    }

    await api.post('survey-entry', surveyEntry)

    clearFormDataFromSession()
    setIsSent(true)
  }

  useEffect(() => {
    loadFormDataFromSession()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line no-nested-ternary
  const page = isLoading ? (
    <Paragraph>Loading…</Paragraph>
  ) : isSent ? (
    <Question>Thank you!</Question>
  ) : (
    <SurveyForm
      initialValues={initialValues}
      onChange={saveFormDataToSession}
      onSubmit={submitSurvey}
      validationSchema={FormSchema}
    >
      {renderBlocks(surveyBlocksManager.blocks)}

      <SurveyForm.Submit>Submit</SurveyForm.Submit>
    </SurveyForm>
  )

  return (
    <Page>
      <Header />

      <Container>
        <Logo />

        <Title>{title}</Title>

        {page}
      </Container>
    </Page>
  )
}
