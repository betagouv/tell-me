import PropTypes from 'prop-types'
import * as R from 'ramda'
import { useState } from 'react'

import { SURVEY_BLOCK_TYPE } from '../../../../common/constants'
import Checkbox from './blocks/Checkbox'
import Choice from './blocks/Choice'
import Input from './blocks/Input'
import Paragraph from './blocks/Paragraph'
import Question from './blocks/Question'
import Editable from './Editable'
import { countPreviousChoices } from './helpers'
import isBlockTypeIndexable from './helpers/isBlockTypeIndexable'
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
  [SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER]: {
    component: Input,
    placeholder: `Type placeholder text`,
  },
}

export default function Block({
  block,
  blocks,
  focusedBlockPosition,
  onChange,
  onChangeType,
  onDown,
  onEnter,
  onRemove,
  onUp,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { position, type, value } = block
  const { component, isRichText, placeholder } = SURVEY_BLOCK_TYPE_COMPONENT[type]
  const isFocused = R.equals(position, focusedBlockPosition)
  const index = isBlockTypeIndexable(type) ? countPreviousChoices(blocks, position) : null
  const isLastBlock = R.equals(position, R.last(blocks).position)
  const key = `${blocks.length}_${position.page}_${position.rank}`

  const finalPlaceholder = index !== null ? `${placeholder} ${index + 1}` : placeholder

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <Row key={key}>
      <Editable
        key={key}
        Component={component}
        index={index}
        isFocused={isFocused}
        isRichText={isRichText}
        onBackspace={() => onRemove(position)}
        onChange={newValue => onChange(position, newValue)}
        onDown={isLastBlock ? null : () => onDown(position)}
        onEnter={() => onEnter(position)}
        onSlash={() => setIsMenuOpen(true)}
        onUp={() => onUp(position)}
        placeholder={finalPlaceholder}
        value={value}
      />

      {isMenuOpen && <Menu onClose={closeMenu} onSelect={newType => onChangeType(position, newType)} />}
    </Row>
  )
}

Block.propTypes = {
  block: Type.Block.isRequired,
  blocks: PropTypes.arrayOf(Type.Block).isRequired,
  focusedBlockPosition: Type.BlockPosition.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeType: PropTypes.func.isRequired,
  onDown: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUp: PropTypes.func.isRequired,
}
