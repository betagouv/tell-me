import PropTypes from 'prop-types'
import { useState } from 'react'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import hashCode from '../../helpers/hashCode'
import Editable from '../../molecules/Editable'
import { SelectOptionShape, SurveyManagerBlockShape } from '../../shapes'
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

export default function Block({
  block,
  index,
  isFocused,
  onChange,
  onChangeCondition,
  onChangeType,
  onDownKeyDown,
  onEnterKeyDown,
  onFocus,
  onRemove,
  onToggleObligation,
  onToggleVisibility,
  onUpKeyDown,
  questionBlockAsOptions,
}) {
  const [isConditionOpen, setIsConditionOpen] = useState(block.ifSelectedThenShowQuestionId !== null)

  const { count, countLetter, type, value } = block
  const { Component, isRichText, placeholder } = SURVEY_BLOCK_TYPE_COMPONENT[type]
  const key = `${index}.${type}.${hashCode(value)}`
  const finalPlaceholder = count !== null ? `${placeholder} ${count}` : placeholder

  const changeCondition = ({ value }) => {
    onChangeCondition(index, value)
  }

  const handleTypeChange = newType => {
    onChangeType(index, newType)
  }

  const toggleCondition = () => {
    if (block.ifSelectedThenShowQuestionId !== null) {
      onChangeCondition(index, null)
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
        count={count}
        countLetter={countLetter}
        defaultValue={value}
        isFocused={isFocused}
        isRichText={isRichText}
        onBackspaceKeyDown={onRemove}
        onChange={onChange}
        onChangeType={handleTypeChange}
        onDownKeyDown={onDownKeyDown}
        onEnterKeyDown={onEnterKeyDown}
        onFocus={() => onFocus(index)}
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
  block: PropTypes.shape(SurveyManagerBlockShape).isRequired,
  index: PropTypes.number.isRequired,
  isFocused: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeCondition: PropTypes.func.isRequired,
  onChangeType: PropTypes.func.isRequired,
  onDownKeyDown: PropTypes.func.isRequired,
  onEnterKeyDown: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onToggleObligation: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  onUpKeyDown: PropTypes.func.isRequired,
  questionBlockAsOptions: PropTypes.arrayOf(PropTypes.shape(SelectOptionShape)).isRequired,
}
