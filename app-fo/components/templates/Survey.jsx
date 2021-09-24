/* eslint-disable react/prop-types */

import * as R from 'ramda'
import styled from 'styled-components'
import * as Yup from 'yup'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import Header from '../atoms/Header'
import Logo from '../atoms/Logo'
import Paragraph from '../atoms/Paragraph'
import Question from '../atoms/Question'
import Title from '../atoms/Title'
import Form from '../molecules/Form'

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
  [SURVEY_BLOCK_TYPE.CONTENT.QUESTION]: {
    Component: Question,
    isIndexable: false,
  },
  [SURVEY_BLOCK_TYPE.CONTENT.TEXT]: {
    Component: Paragraph,
    isIndexable: false,
  },
  [SURVEY_BLOCK_TYPE.INPUT.CHOICE]: {
    Component: Form.RadioInput,
    isIndexable: true,
  },
}

const FormSchema = Yup.object().shape({})

const isQuestion = R.pipe(R.prop('type'), R.equals(SURVEY_BLOCK_TYPE.CONTENT.QUESTION))

const renderBlocks = blocks => {
  let indexableBlockIndex = null
  let questionId = null

  return blocks.reduce((components, block, index) => {
    const { _id: id, type, value } = block
    const { Component, isIndexable } = SURVEY_BLOCK_TYPE_COMPONENT[type]
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

    const newComponent = (
      <Component
        key={id}
        dangerouslySetInnerHTML={innerHTML}
        id={id}
        index={indexableBlockIndex}
        name={questionId}
        value={id}
      />
    )

    return [...components, newComponent]
  }, [])
}

export default function PublicSurvey({ data }) {
  const { blocks, title } = data

  return (
    <Page>
      <Header />

      <Container>
        <Logo />

        <Title>{title}</Title>

        <Form initialValues={{}} onSubmit={() => undefined} validationSchema={FormSchema}>
          {/* <Form.Input autoComplete="email" label="Email" name="email" type="email" />
          <Form.Input autoComplete="current-password" label="Password" name="password" type="password" /> */}
          {renderBlocks(blocks)}

          {/* <Form.Submit>Log In</Form.Submit> */}
        </Form>
      </Container>
    </Page>
  )
}
