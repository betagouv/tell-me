import { SURVEY_BLOCK_TYPE } from '@common/constants'
import BetterPropTypes from 'better-prop-types'
import { FunctionComponent, MutableRefObject, useRef, useState } from 'react'

import hashCode from '../../helpers/hashCode'
import LegacySurveyManagerBlock from '../../libs/LegacySurveyManager/Block'
import LegacyEditable from '../../molecules/LegacyEditable'
import { SelectOptionShape } from '../../shapes'
import Checkbox from './blocks/Checkbox'
import FileInput from './blocks/FileInput'
import Paragraph from './blocks/Paragraph'
import Question from './blocks/Question'
import Radio from './blocks/Radio'
import Textarea from './blocks/Textarea'
import TextInput from './blocks/TextInput'
import Condition from './Condition'
import Row from './Row'

const SURVEY_BLOCK_TYPE_COMPONENT = {
  [SURVEY_BLOCK_TYPE.CONTENT.QUESTION]: {
    Component: Question,
    isRichText: false,
    placeholder: `What is your question?`,
  },
  [SURVEY_BLOCK_TYPE.CONTENT.TEXT]: {
    Component: Paragraph,
    isRichText: true,
    placeholder: `Insert some text or type '/' to insert a new type of block`,
  },
  [SURVEY_BLOCK_TYPE.INPUT.CHOICE]: {
    Component: Radio,
    isRichText: false,
    placeholder: `Option`,
  },
  [SURVEY_BLOCK_TYPE.INPUT.CHECKBOX]: {
    Component: Checkbox,
    isRichText: false,
    placeholder: `Choice`,
  },
  [SURVEY_BLOCK_TYPE.INPUT.FILE]: {
    Component: FileInput,
    isRichText: false,
    placeholder: `Choose a file…`,
  },
  [SURVEY_BLOCK_TYPE.INPUT.LONG_ANSWER]: {
    Component: Textarea,
    isRichText: false,
    placeholder: `Type placeholder text`,
  },
  [SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER]: {
    Component: TextInput,
    isRichText: false,
    placeholder: `Type placeholder text`,
  },
}

type BlockProps = {
  block: LegacySurveyManagerBlock
  index: any
  isFocused: any
  onAppendBlockAt: any
  onChangeAt: (index: number, newValue: string) => void
  onChangeConditionAt: (index: number, questionBlockId: Common.Nullable<string>) => void
  onChangeTypeAt: (index: number, newType: string) => void
  onDownKeyDown: any
  onFocus: any
  onRemove: any
  onRemoveAt: (index: number) => void
  onToggleObligation: any
  onToggleVisibility: any
  onUpKeyDown: any
  questionBlockAsOptions: any
}
const Block: FunctionComponent<BlockProps> = ({
  block,
  index,
  isFocused,
  onAppendBlockAt,
  onChangeAt,
  onChangeConditionAt,
  onChangeTypeAt,
  onDownKeyDown,
  onFocus,
  onRemove,
  onRemoveAt,
  onToggleObligation,
  onToggleVisibility,
  onUpKeyDown,
  questionBlockAsOptions,
}) => {
  const valueRef = useRef(block.value) as MutableRefObject<string>
  const [isConditionOpen, setIsConditionOpen] = useState(block.ifSelectedThenShowQuestionId !== null)

  const { Component, isRichText, placeholder } = SURVEY_BLOCK_TYPE_COMPONENT[block.type]
  const key = `${index}.${block.type}.${isFocused}.${hashCode(block.value)}`
  const finalPlaceholder = block.count !== null ? `${placeholder} ${block.count}` : placeholder

  const changeCondition = ({ value }) => {
    onChangeConditionAt(index, value)
  }

  const handleChange = (newValue: string) => {
    valueRef.current = newValue

    onChangeAt(index, newValue)
  }

  const handleDelete = () => {
    onRemoveAt(index)
  }

  const handleEnterKeyDown = () => {
    if (block.isCountable) {
      if (valueRef.current.length > 0) {
        onAppendBlockAt(index, block.type)
      } else {
        onChangeTypeAt(index, SURVEY_BLOCK_TYPE.CONTENT.TEXT)
      }

      return
    }

    onAppendBlockAt(index, SURVEY_BLOCK_TYPE.CONTENT.TEXT)
  }

  const handleFocus = () => {
    onFocus(index)
  }

  const handleTypeChange = (newType: string) => {
    onChangeTypeAt(index, newType)
  }

  const toggleCondition = () => {
    if (block.ifSelectedThenShowQuestionId !== null) {
      onChangeConditionAt(index, null)
    }

    setIsConditionOpen(!isConditionOpen)
  }

  const toggleObligation = () => {
    onToggleObligation(index)
  }

  const toggleVisibility = () => {
    onToggleVisibility(index)
  }

  return (
    <Row
      block={block}
      onCondition={toggleCondition}
      onDelete={handleDelete}
      onToggleObligation={toggleObligation}
      onToggleVisibility={toggleVisibility}
    >
      <LegacyEditable
        key={key}
        as={Component}
        count={block.count}
        countLetter={block.countLetter}
        defaultValue={block.value}
        isFocused={isFocused}
        isRichText={isRichText}
        onBackspaceKeyDown={onRemove}
        onChange={handleChange}
        onChangeType={handleTypeChange}
        onDownKeyDown={onDownKeyDown}
        onEnterKeyDown={handleEnterKeyDown}
        onFocus={handleFocus}
        onUpKeyDown={onUpKeyDown}
        placeholder={finalPlaceholder}
      />

      {isConditionOpen && (
        <Condition block={block} onChange={changeCondition} questionBlockAsOptions={questionBlockAsOptions} />
      )}
    </Row>
  )
}

Block.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  block: BetterPropTypes.any.isRequired,
  index: BetterPropTypes.number.isRequired,
  isFocused: BetterPropTypes.bool.isRequired,
  onAppendBlockAt: BetterPropTypes.func.isRequired,
  onChangeAt: BetterPropTypes.func.isRequired,
  onChangeConditionAt: BetterPropTypes.func.isRequired,
  onChangeTypeAt: BetterPropTypes.func.isRequired,
  onDownKeyDown: BetterPropTypes.func.isRequired,
  onFocus: BetterPropTypes.func.isRequired,
  onRemove: BetterPropTypes.func.isRequired,
  onRemoveAt: BetterPropTypes.func.isRequired,
  onToggleObligation: BetterPropTypes.func.isRequired,
  onToggleVisibility: BetterPropTypes.func.isRequired,
  onUpKeyDown: BetterPropTypes.func.isRequired,
  questionBlockAsOptions: BetterPropTypes.arrayOf(BetterPropTypes.shape(SelectOptionShape)).isRequired,
}

export default Block
