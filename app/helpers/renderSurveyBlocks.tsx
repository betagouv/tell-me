import styled from 'styled-components'

import { SurveyParagraph } from '../atoms/SurveyParagraph'
import { SurveyQuestion } from '../atoms/SurveyQuestion'
import { SurveyForm } from '../molecules/SurveyForm'

import type { Block } from '../libs/SurveyEditorManager/Block'
import type { TellMe } from '@schemas/1.0.0/TellMe'
import type { FormikContextType } from 'formik'

const Row = styled.div<{
  isQuestion: boolean
}>`
  display: flex;
  margin-top: ${p => (p.isQuestion ? p.theme.padding.layout.large : 0)};
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

  let indexableBlockIndex: Common.Nullable<number> = null
  let isHidden: boolean = false
  let questionId: Common.Nullable<string> = null

  return blocks.reduce<JSX.Element[]>((components, block, index) => {
    if (block.isQuestion) {
      questionId = block.id

      if (block.isHidden) {
        const neededBlocks = blocks.filter(
          _block =>
            _block.isInput && _block.questionId !== null && _block.ifTruethyThenShowQuestionIds.includes(block.id),
        )

        const found = neededBlocks.find(_block => {
          if (_block.questionId === null) {
            return false
          }

          const valueOrValues: string | string[] | undefined = values[_block.questionId]
          if (valueOrValues === undefined) {
            return false
          }

          switch (_block.type) {
            case 'input_choice':
              return typeof valueOrValues === 'string' && valueOrValues === _block.value

            case 'input_multiple_choice':
              return Array.isArray(valueOrValues) && valueOrValues.includes(_block.value)

            default:
              return typeof valueOrValues === 'string' && valueOrValues.trim().length > 0
          }
        })

        if (found === undefined) {
          isHidden = true

          return components
        }
      }

      isHidden = false
    } else if (isHidden) {
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

    const newComponent = block.isInput ? (
      <Component
        key={block.id}
        countLetter={block.countLetter}
        index={indexableBlockIndex}
        label={label}
        name={questionId}
        value={label}
      />
    ) : (
      <Row key={block.id} isQuestion={block.isQuestion}>
        <Component dangerouslySetInnerHTML={innerHTML} />

        {block.isRequired && <Asterisk>*</Asterisk>}
      </Row>
    )

    if (submitCount === 0 || !errors[block.id]) {
      return [...components, newComponent]
    }

    // The `.name` case covers Yup file input validation:
    const error = (errors[block.id] as any).name || errors[block.id]

    return [...components, newComponent, <Error key={`${block.id}.error`}>{error}</Error>]
  }, [])
}
