import { Select, styled } from '@singularity-ui/core'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { CornerDownRight } from 'react-feather'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import { SelectOptionShape, SurveyManagerBlockShape } from '../../shapes'
import Checkbox from './blocks/Checkbox'
import Paragraph from './blocks/Paragraph'
import Question from './blocks/Question'
import Radio from './blocks/Radio'
import Textarea from './blocks/Textarea'
import TextInput from './blocks/TextInput'
import Editable from './Editable'
import Menu from './Menu'
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

const Condition = styled.div`
  display: flex;
  padding: 0.5rem 0;

  > svg {
    margin: 0.25rem 0.5rem 0 0.6rem;
  }
`

const StyledSelect = styled(Select)`
  width: 100%;
`

export default function Block({
  block,
  blocks,
  index,
  isFocused,
  onChange,
  onChangeCondition,
  onChangeType,
  onDown,
  onEnter,
  onFocus,
  onRemove,
  onToggleVisibility,
  onUp,
  questionBlockAsOptions,
}) {
  // console.log(questionBlockAsOptions)

  const [isConditionOpen, setIsConditionOpen] = useState(block.ifSelectedThenShowQuestionId !== null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { count, countLetter, position, type, value } = block
  const { component, isRichText, placeholder } = SURVEY_BLOCK_TYPE_COMPONENT[type]
  const key = `${blocks.length}_${position.page}_${position.rank}`
  const finalPlaceholder = count !== null ? `${placeholder} ${count}` : placeholder

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const setCondition = ({ value }) => {
    onChangeCondition(index, value)
  }

  const toggleCondition = () => {
    if (block.ifSelectedThenShowQuestionId !== null) {
      onChangeCondition(index, null)
    }

    setIsConditionOpen(!isConditionOpen)
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
        onSlash={() => setIsMenuOpen(true)}
        onUp={onUp}
        placeholder={finalPlaceholder}
        value={value}
      />

      {isConditionOpen && (
        <Condition>
          <CornerDownRight />
          <StyledSelect
            defaultValue={block.questionBlockAsOption}
            onChange={setCondition}
            options={questionBlockAsOptions}
            size="small"
          />
        </Condition>
      )}

      {isMenuOpen && <Menu onClose={closeMenu} onSelect={newType => onChangeType(index, newType)} />}
    </Row>
  )
}

Block.propTypes = {
  block: PropTypes.shape(SurveyManagerBlockShape).isRequired,
  blocks: PropTypes.arrayOf(PropTypes.shape(SurveyManagerBlockShape)).isRequired,
  index: PropTypes.number.isRequired,
  isFocused: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeCondition: PropTypes.func.isRequired,
  onChangeType: PropTypes.func.isRequired,
  onDown: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  onUp: PropTypes.func.isRequired,
  questionBlockAsOptions: PropTypes.arrayOf(PropTypes.shape(SelectOptionShape)).isRequired,
}
