import PropTypes from 'prop-types'
import { useState } from 'react'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import Checkbox from './blocks/Checkbox'
import Choice from './blocks/Choice'
import Input from './blocks/Input'
import Paragraph from './blocks/Paragraph'
import Question from './blocks/Question'
import Textarea from './blocks/Textarea'
import Editable from './Editable'
import Menu from './Menu'
import Row from './Row'
import * as Type from './types'

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
    component: Choice,
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
    component: Input,
    placeholder: `Type placeholder text`,
  },
}

export default function Block({
  block,
  blocks,
  index,
  isFocused,
  onChange,
  onChangeType,
  onDown,
  onEnter,
  onFocus,
  onRemove,
  onUp,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { count, countLetter, position, type, value } = block
  const { component, isRichText, placeholder } = SURVEY_BLOCK_TYPE_COMPONENT[type]
  const key = `${blocks.length}_${position.page}_${position.rank}`

  const finalPlaceholder = count !== null ? `${placeholder} ${count}` : placeholder

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <Row key={key} className="Row">
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

      {isMenuOpen && <Menu onClose={closeMenu} onSelect={newType => onChangeType(index, newType)} />}
    </Row>
  )
}

Block.propTypes = {
  block: Type.Block.isRequired,
  blocks: PropTypes.arrayOf(Type.Block).isRequired,
  index: PropTypes.number.isRequired,
  isFocused: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeType: PropTypes.func.isRequired,
  onDown: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUp: PropTypes.func.isRequired,
}
