/* eslint-disable react/prop-types */

import { FormikContextType, useFormikContext } from 'formik'
import * as R from 'ramda'
import styled from 'styled-components'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import SurveyParagraph from '../../atoms/SurveyParagraph'
import SurveyQuestion from '../../atoms/SurveyQuestion'
import Block from '../../libs/LegacySurveyManager/Block'
import SurveyForm from '../../molecules/SurveyForm'
import isBlockTypeIndexable from '../LegacySurveyEditor/helpers/isBlockTypeIndexable'

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

const SURVEY_BLOCK_TYPE_COMPONENT = {
  [SURVEY_BLOCK_TYPE.CONTENT.QUESTION]: SurveyQuestion,
  [SURVEY_BLOCK_TYPE.CONTENT.TEXT]: SurveyParagraph,
  [SURVEY_BLOCK_TYPE.INPUT.CHECKBOX]: SurveyForm.Checkbox,
  [SURVEY_BLOCK_TYPE.INPUT.CHOICE]: SurveyForm.Radio,
  [SURVEY_BLOCK_TYPE.INPUT.FILE]: SurveyForm.FileInput,
  [SURVEY_BLOCK_TYPE.INPUT.LONG_ANSWER]: SurveyForm.Textarea,
  [SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER]: SurveyForm.TextInput,
}

const renderBlocks = (formikContext: FormikContextType<any>, blocks: Block[]) => {
  const { errors, submitCount, values } = formikContext

  let indexableBlockIndex: Common.Nullable<number> = null
  let isHidden: boolean = false
  let questionId: Common.Nullable<string> = null

  return blocks.reduce<any[]>((components, block, index) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id, countLetter, isQuestion, type, value } = block

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

    const Component = SURVEY_BLOCK_TYPE_COMPONENT[type] as any
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
      <Row key={_id} isQuestion={isQuestion}>
        <Component dangerouslySetInnerHTML={innerHTML} />

        {block.isMandatory && <Asterisk>*</Asterisk>}
      </Row>
    )

    if (submitCount === 0 || !errors[_id]) {
      return [...components, newComponent]
    }

    // The `.name` case covers Yup file input validation:
    const error = (errors[_id] as any).name || errors[_id]

    return [...components, newComponent, <Error key={`${_id}.error`}>{error}</Error>]
  }, [])
}

export default function Blocks({ blocks }) {
  const formikContext = useFormikContext()

  return <>{renderBlocks(formikContext, blocks)}</>
}
