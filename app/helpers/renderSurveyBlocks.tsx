import styled from 'styled-components'

import { SurveyParagraph } from '../atoms/SurveyParagraph'
import { SurveyQuestion } from '../atoms/SurveyQuestion'
import { SurveyForm } from '../molecules/SurveyForm'
import { isSurveyBlockVisible } from './isSurveyBlockVisible'

import type { Block } from '../libs/SurveyEditorManager/Block'
import type { TellMe } from '@schemas/1.0.0/TellMe'
import type { FormikContextType } from 'formik'

const Question = styled.h2`
  margin-top: ${p => p.theme.padding.layout.large};
`

const Error = styled.p`
  color: ${p => p.theme.color.danger.active};
  font-weight: 700;
  padding-bottom: 0.5rem;
`

const SURVEY_BLOCK_TYPE_COMPONENT: Record<TellMe.BlockType, any> = {
  action_next: () => null,
  action_submit: () => null,
  content_subtitle: () => null,
  content_text: SurveyParagraph,
  input_checkbox: () => null,
  input_choice: SurveyForm.Radio,
  input_email: () => null,
  input_file: SurveyForm.FileInput,
  input_linear_scale: () => null,
  input_link: () => null,
  input_long_answer: SurveyForm.Textarea,
  input_multiple_choice: SurveyForm.Checkbox,
  input_number: () => null,
  input_phone: () => null,
  input_rating: () => null,
  input_short_answer: SurveyForm.TextInput,
  question: SurveyQuestion,
}

export function renderSurveyBlocks(formikContext: FormikContextType<Record<string, string>>, blocks: Block[]) {
  const { errors, submitCount, values } = formikContext

  let indexableBlockIndex: number | null = null

  return blocks.reduce<JSX.Element[]>((components, block, index) => {
    if (!isSurveyBlockVisible(block, blocks, values)) {
      return components
    }

    const Component = SURVEY_BLOCK_TYPE_COMPONENT[block.type] as any
    const lastBlock = index > 0 ? blocks[index - 1] : null

    if (!block.isCountable) {
      indexableBlockIndex = null
    } else if (block.type === lastBlock?.type && indexableBlockIndex !== null) {
      indexableBlockIndex += 1
    } else {
      indexableBlockIndex = 0
    }

    const innerHTML = { __html: block.value }
    const label = block.value

    let newComponent
    if (block.isInput) {
      newComponent = (
        <Component
          key={block.id}
          countLetter={block.countLetter}
          index={indexableBlockIndex}
          label={label}
          name={block.questionId}
          value={label}
        />
      )
    } else if (block.isQuestion) {
      newComponent = (
        <Question key={block.id} id={`question-${block.id}`}>
          {`${block.value}${block.isRequired ? ' *' : ''}`}
        </Question>
      )
    } else {
      newComponent = (
        <Component
          key={block.id}
          dangerouslySetInnerHTML={innerHTML}
          id={block.isQuestion ? `question-${block.id}` : undefined}
        />
      )
    }

    if (submitCount === 0 || !errors[block.id]) {
      return [...components, newComponent]
    }

    // The `.name` case covers Yup file input validation:
    const error = (errors[block.id] as any).name || errors[block.id]

    return [...components, newComponent, <Error key={`${block.id}.error`}>{error}</Error>]
  }, [])
}
