import { useRef, useState } from 'react'

import { hashCode } from '../../helpers/hashCode'
import { Editable } from '../Editable'
import { Checkbox } from './blocks/Checkbox'
import { FileInput } from './blocks/FileInput'
import { Paragraph } from './blocks/Paragraph'
import { Question } from './blocks/Question'
import { Radio } from './blocks/Radio'
import { Textarea } from './blocks/Textarea'
import { TextInput } from './blocks/TextInput'
import { Title } from './blocks/Title'
import { Condition } from './Condition'
import { Header } from './Header'
import { Loader } from './Loader'
import { Logo } from './Logo'
import { Row } from './Row'

import type { Block as SurveyEditorManagerBlock } from '../../libs/SurveyEditorManager/Block'
import type { TellMe } from '@schemas/1.0.0/TellMe'
import type { MutableRefObject } from 'react'

const SURVEY_BLOCK_TYPE_COMPONENT: Record<
  TellMe.BlockType,
  {
    Component: any
    isRichText: boolean
    placeholder: string
  }
> = {
  action_next: {
    Component: () => null,
    isRichText: false,
    placeholder: `TODO`,
  },
  action_submit: {
    Component: () => null,
    isRichText: false,
    placeholder: `TODO`,
  },
  content_subtitle: {
    Component: () => null,
    isRichText: false,
    placeholder: `TODO`,
  },
  content_text: {
    Component: Paragraph,
    isRichText: true,
    placeholder: `Insert some text or type '/' to insert a new type of block`,
  },
  input_checkbox: {
    Component: () => null,
    isRichText: false,
    placeholder: `TODO`,
  },
  input_choice: {
    Component: Radio,
    isRichText: false,
    placeholder: `Option`,
  },
  input_email: {
    Component: () => null,
    isRichText: false,
    placeholder: `TODO`,
  },
  input_file: {
    Component: FileInput,
    isRichText: false,
    placeholder: `Choose a file…`,
  },
  input_linear_scale: {
    Component: () => null,
    isRichText: false,
    placeholder: `TODO`,
  },
  input_link: {
    Component: () => null,
    isRichText: false,
    placeholder: `TODO`,
  },
  input_long_answer: {
    Component: Textarea,
    isRichText: false,
    placeholder: `Type placeholder text`,
  },
  input_multiple_choice: {
    Component: Checkbox,
    isRichText: false,
    placeholder: `Choice`,
  },
  input_number: {
    Component: () => null,
    isRichText: false,
    placeholder: `TODO`,
  },
  input_phone: {
    Component: () => null,
    isRichText: false,
    placeholder: `TODO`,
  },
  input_rating: {
    Component: () => null,
    isRichText: false,
    placeholder: `TODO`,
  },
  input_short_answer: {
    Component: TextInput,
    isRichText: false,
    placeholder: `Type placeholder text`,
  },
  question: {
    Component: Question,
    isRichText: false,
    placeholder: `What is your question?`,
  },
}

type BlockProps = {
  block: SurveyEditorManagerBlock
  index: any
  isFocused: any
  onAppendBlockAt: any
  onChangeAt: (index: number, newValue: string) => void
  onChangeConditionAt: (index: number, newQuestionBlocksIds: string[]) => void
  onChangeTypeAt: (index: number, newType: TellMe.BlockType) => void
  onDownKeyDown: any
  onFocus: any
  onRemove: any
  onRemoveAt: (index: number) => void
  onToggleObligation: any
  onToggleVisibility: any
  onUpKeyDown: any
  questionBlocksAsOptions: Common.App.SelectOption[]
}
function Block({
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
  questionBlocksAsOptions,
}: BlockProps) {
  const $value = useRef(block.value) as MutableRefObject<string>
  const [isConditionOpen, setIsConditionOpen] = useState(block.ifTruethyThenShowQuestionIds.length > 0)

  const { Component, isRichText, placeholder } = SURVEY_BLOCK_TYPE_COMPONENT[block.type]
  const key = `${index}.${block.type}.${isFocused}.${hashCode(block.value)}`
  const finalPlaceholder = block.count !== null ? `${placeholder} ${block.count}` : placeholder

  const changeCondition = (newQuestionBlocksIds: string[]) => {
    onChangeConditionAt(index, newQuestionBlocksIds)
  }

  const handleChange = (newValue: string) => {
    $value.current = newValue

    onChangeAt(index, newValue)
  }

  const handleDelete = () => {
    onRemoveAt(index)
  }

  const handleEnterKeyDown = () => {
    if (block.isCountable) {
      if ($value.current.length > 0) {
        onAppendBlockAt(index, block.type)
      } else {
        onChangeTypeAt(index, 'content_text')
      }

      return
    }

    onAppendBlockAt(index, 'content_text')
  }

  const handleFocus = () => {
    onFocus(index)
  }

  const handleTypeChange = (newType: TellMe.BlockType) => {
    onChangeTypeAt(index, newType)
  }

  const toggleCondition = () => {
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
        <Condition block={block} onChange={changeCondition} questionBlocksAsOptions={questionBlocksAsOptions} />
      )}
    </Row>
  )
}

export { Block, Header, Loader, Logo, Title }
