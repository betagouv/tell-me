import { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { Editable } from '../../molecules/Editable'
import { Checkbox } from './blocks/Checkbox'
import { FileInput } from './blocks/FileInput'
import { Paragraph } from './blocks/Paragraph'
import { Question } from './blocks/Question'
import { Radio } from './blocks/Radio'
import { Textarea } from './blocks/Textarea'
import { TextInput } from './blocks/TextInput'
import { Condition } from './Condition'
import { Key } from './Key'
import { Row } from './Row'

import type { Block } from '../../libs/SurveyEditorManager/Block'
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

const Box = styled.div<{
  isQuestion: boolean
}>`
  margin-top: ${p => (p.isQuestion ? p.theme.padding.layout.giant : 0)};
`

type BlockEditorProps = {
  block: Block
  index: any
  isFocused: any
  onAppendBlockAt: any
  onChangeAt: (blockIndex: number, newValue: string) => void | Promise<void>
  onChangeConditionAt: (blockIndex: number, newQuestionBlocksIds: string[]) => void | Promise<void>
  /** Only applies to 'question' blocks. */
  onChangeKeyAt: (blockIndex: number, newKey: string | null) => void | Promise<void>
  onChangeTypeAt: (blockIndex: number, newType: TellMe.BlockType) => void | Promise<void>
  onDownKeyDown: Common.FunctionLike
  onFocusAt: (blockIndex: number) => void | Promise<void>
  onRemove: Common.FunctionLike
  onRemoveAt: (blockIndex: number) => void | Promise<void>
  onToggleObligation: any
  onToggleVisibility: any
  onUpKeyDown: any
  questionBlocksAsOptions: Common.App.SelectOption[]
}
export function BlockEditor({
  block,
  index,
  isFocused,
  onAppendBlockAt,
  onChangeAt,
  onChangeConditionAt,
  onChangeKeyAt,
  onChangeTypeAt,
  onDownKeyDown,
  onFocusAt,
  onRemove,
  onRemoveAt,
  onToggleObligation,
  onToggleVisibility,
  onUpKeyDown,
  questionBlocksAsOptions,
}: BlockEditorProps) {
  const $value = useRef(block.value) as MutableRefObject<string>
  const [isConditionOpen, setIsConditionOpen] = useState(block.ifTruethyThenShowQuestionIds.length > 0)
  const [isKeyOpen, setIsKeyOpen] = useState(block.key !== null)

  const { Component, isRichText, placeholder } = SURVEY_BLOCK_TYPE_COMPONENT[block.type]
  const finalPlaceholder = block.count !== null ? `${placeholder} ${block.count}` : placeholder

  const handleConditionChange = useCallback(
    (newQuestionBlocksIds: string[]) => {
      onChangeConditionAt(index, newQuestionBlocksIds)
    },
    [index],
  )

  const handleChange = useCallback(
    (newValue: string) => {
      $value.current = newValue

      onChangeAt(index, newValue)
    },
    [index],
  )

  const handleDelete = useCallback(() => {
    onRemoveAt(index)
  }, [index])

  const handleEnterKeyDown = useCallback(() => {
    if (block.isCountable) {
      if ($value.current.length > 0) {
        onAppendBlockAt(index, block.type)
      } else {
        onChangeTypeAt(index, 'content_text')
      }

      return
    }

    onAppendBlockAt(index, 'content_text')
  }, [block.isCountable, index])

  const handleKeyChange = useCallback(
    (newKey: string | null) => {
      onChangeKeyAt(index, newKey)
    },
    [index],
  )

  const handleFocus = useCallback(() => {
    onFocusAt(index)
  }, [index])

  const handleTypeChange = useCallback(
    (newType: TellMe.BlockType) => {
      onChangeTypeAt(index, newType)
    },
    [index],
  )

  const toggleCondition = useCallback(() => {
    if (isConditionOpen) {
      handleConditionChange([])
    }

    setIsConditionOpen(!isConditionOpen)
  }, [isConditionOpen])

  const toggleKey = useCallback(() => {
    if (isKeyOpen) {
      handleKeyChange(null)
    }

    setIsKeyOpen(!isKeyOpen)
  }, [isKeyOpen])

  const toggleObligation = useCallback(() => {
    onToggleObligation(index)
  }, [index])

  const toggleVisibility = useCallback(() => {
    onToggleVisibility(index)
  }, [index])

  return (
    <Box isQuestion={block.isQuestion}>
      {isKeyOpen && <Key block={block} onChange={handleKeyChange} />}

      <Row
        block={block}
        onClickCondition={toggleCondition}
        onClickDelete={handleDelete}
        onClickKey={toggleKey}
        onToggleObligation={toggleObligation}
        onToggleVisibility={toggleVisibility}
      >
        <Editable
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
          <Condition block={block} onChange={handleConditionChange} questionBlocksAsOptions={questionBlocksAsOptions} />
        )}
      </Row>
    </Box>
  )
}
