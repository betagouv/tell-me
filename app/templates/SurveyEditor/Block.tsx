import PropTypes from 'prop-types'
import { FunctionComponent, MutableRefObject, useRef, useState } from 'react'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import hashCode from '../../helpers/hashCode'
import SurveyManagerBlock from '../../libs/SurveyManager/Block'
import Editable from '../../molecules/Editable'
import { SelectOptionShape } from '../../shapes'
import Checkbox from './blocks/Checkbox'
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
  block: SurveyManagerBlock
  index: any
  isFocused: any
  onAppendBlockAt: any
  onChangeAt: (index: number, newValue: string) => void
  onChangeConditionAt: (index: number, questionBlockId: Common.Nullable<string>) => void
  onChangeTypeAt: (index: number, newType: string) => void
  onDownKeyDown: any
  onFocus: any
  onRemove: any
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
  onToggleObligation,
  onToggleVisibility,
  onUpKeyDown,
  questionBlockAsOptions,
}) => {
  const valueRef = useRef(block.value) as MutableRefObject<string>
  const [isConditionOpen, setIsConditionOpen] = useState(block.ifSelectedThenShowQuestionId !== null)

  const { Component, isRichText, placeholder } = SURVEY_BLOCK_TYPE_COMPONENT[block.type]
  const key = `${index}.${block.type}.${hashCode(block.value)}`
  const finalPlaceholder = block.count !== null ? `${placeholder} ${block.count}` : placeholder

  const changeCondition = ({ value }) => {
    onChangeConditionAt(index, value)
  }

  const handleChange = (newValue: string) => {
    valueRef.current = newValue

    onChangeAt(index, newValue)
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
      key={key}
      block={block}
      onCondition={toggleCondition}
      onDelete={onRemove}
      onToggleObligation={toggleObligation}
      onToggleVisibility={toggleVisibility}
    >
      <Editable
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
  block: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  isFocused: PropTypes.bool.isRequired,
  onAppendBlockAt: PropTypes.func.isRequired,
  onChangeAt: PropTypes.func.isRequired,
  onChangeConditionAt: PropTypes.func.isRequired,
  onChangeTypeAt: PropTypes.func.isRequired,
  onDownKeyDown: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onToggleObligation: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  onUpKeyDown: PropTypes.func.isRequired,
  questionBlockAsOptions: PropTypes.arrayOf(PropTypes.shape(SelectOptionShape)).isRequired,
}

export default Block
