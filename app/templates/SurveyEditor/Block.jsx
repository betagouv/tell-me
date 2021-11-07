import PropTypes from 'prop-types'
import { useState } from 'react'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import hashCode from '../../helpers/hashCode'
import { SelectOptionShape, SurveyManagerBlockShape } from '../../shapes'
import BlockMenu from './BlockMenu'
import Checkbox from './blocks/Checkbox'
import Paragraph from './blocks/Paragraph'
import Question from './blocks/Question'
import Radio from './blocks/Radio'
import Textarea from './blocks/Textarea'
import TextInput from './blocks/TextInput'
import Condition from './Condition'
import Editable from './Editable'
import Row from './Row'

const SURVEY_BLOCK_TYPE_COMPONENT = {
  [SURVEY_BLOCK_TYPE.CONTENT.QUESTION]: {
    component: Question,
    placeholder: `What is your question?`,
  },
  [SURVEY_BLOCK_TYPE.CONTENT.TEXT]: {
    component: Paragraph,
    isRichText: true,
    placeholder: `Insert some text or type '/' to insert a new type of block`,
  },
  [SURVEY_BLOCK_TYPE.INPUT.CHOICE]: {
    component: Radio,
    placeholder: `Option`,
  },
  [SURVEY_BLOCK_TYPE.INPUT.CHECKBOX]: {
    component: Checkbox,
    placeholder: `Choice`,
  },
  [SURVEY_BLOCK_TYPE.INPUT.LONG_ANSWER]: {
    component: Textarea,
    placeholder: `Type placeholder text`,
  },
  [SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER]: {
    component: TextInput,
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
  onDown,
  onEnter,
  onFocus,
  onRemove,
  onToggleObligation,
  onToggleVisibility,
  onUp,
  questionBlockAsOptions,
}) {
  const [isConditionOpen, setIsConditionOpen] = useState(block.ifSelectedThenShowQuestionId !== null)
  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState(false)

  const { count, countLetter, type, value } = block
  const { component, isRichText, placeholder } = SURVEY_BLOCK_TYPE_COMPONENT[type]
  const key = `${index}.${type}.${hashCode(value)}`
  const finalPlaceholder = count !== null ? `${placeholder} ${count}` : placeholder

  const openBlockMenu = () => {
    setIsBlockMenuOpen(true)
  }

  const closeBlockMenu = () => {
    setIsBlockMenuOpen(false)
  }

  const changeCondition = ({ value }) => {
    onChangeCondition(index, value)
  }

  const changeType = newType => {
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
      className="Row"
      onCondition={toggleCondition}
      onDelete={onRemove}
      onToggleObligation={toggleObligation}
      onToggleVisibility={toggleVisibility}
    >
      <Editable
        key={key}
        Component={component}
        count={count}
        countLetter={countLetter}
        isFocused={isFocused}
        isRichText={isRichText}
        onBackspace={onRemove}
        onChange={onChange}
        onDown={onDown}
        onEnter={onEnter}
        onFocus={() => onFocus(index)}
        onSlash={openBlockMenu}
        onUp={onUp}
        placeholder={finalPlaceholder}
        value={value}
      />

      {isConditionOpen && (
        <Condition block={block} onChange={changeCondition} questionBlockAsOptions={questionBlockAsOptions} />
      )}

      {isBlockMenuOpen && <BlockMenu onClose={closeBlockMenu} onSelect={changeType} />}
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
  onDown: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onToggleObligation: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  onUp: PropTypes.func.isRequired,
  questionBlockAsOptions: PropTypes.arrayOf(PropTypes.shape(SelectOptionShape)).isRequired,
}
