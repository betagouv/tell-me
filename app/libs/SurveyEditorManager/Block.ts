import { getCountLetter, isInputBlock, isQuestionBlock } from './helpers'

import type { BlockConstructorOptions } from './types'
import type { TellMe } from '@schemas/1.0.0/TellMe'

export class Block {
  public readonly data: TellMe.BlockData
  public readonly id: string
  public readonly type: TellMe.BlockType
  public readonly value: string

  #count: number | null
  #countLetter: string | null
  #ifTruethyThenShowQuestionIds: string[]
  #ifTruethyThenShowQuestionsAsOptions: Common.App.SelectOption[]
  #isCheckbox: boolean
  #isChoice: boolean
  /** If `true`, this means that this block is an multi-blocks input, most likely a radio or select-like one. */
  #isCountable: boolean
  #isHidden: boolean
  #isInput: boolean
  #isRequired: boolean
  #isQuestion: boolean
  /** If `true`, this means that this block is an input that can't be linked to a parent question block. */
  #isUnlinked: boolean
  #key: string | null
  #questionId: string | null
  #questionInputType: TellMe.BlockType | null

  constructor(
    block: TellMe.TreeBlock,
    {
      count,
      ifTruethyThenShowQuestionsAsOptions,
      isCountable,
      isHidden,
      questionId,
      questionInputType,
    }: BlockConstructorOptions,
  ) {
    this.#count = isCountable && count !== undefined ? count : null
    this.#countLetter = isCountable && count !== undefined ? getCountLetter(count) : null
    this.#ifTruethyThenShowQuestionIds = (block.data as any).ifTruethyThenShowQuestionIds || []
    this.#ifTruethyThenShowQuestionsAsOptions = ifTruethyThenShowQuestionsAsOptions || []
    this.#isCheckbox = block.type === 'input_multiple_choice'
    this.#isChoice = block.type === 'input_choice'
    this.#isCountable = isCountable
    this.#isHidden = isHidden
    this.#isInput = isInputBlock(block)
    this.#isRequired = Boolean((block.data as any).isRequired)
    this.#isQuestion = isQuestionBlock(block)
    this.#isUnlinked = false
    this.#key = (block.data as any).key ?? null
    this.#questionId = questionId
    this.#questionInputType = questionInputType || null

    this.id = block.id
    this.data = block.data
    this.type = block.type
    this.value = block.value
  }

  public get count() {
    return this.#count
  }

  public get countLetter() {
    return this.#countLetter
  }

  public get ifTruethyThenShowQuestionIds() {
    return this.#ifTruethyThenShowQuestionIds
  }

  public set ifTruethyThenShowQuestionIds(newValue: string[]) {
    this.#ifTruethyThenShowQuestionIds = newValue
  }

  public get ifTruethyThenShowQuestionsAsOptions() {
    return this.#ifTruethyThenShowQuestionsAsOptions
  }

  public set ifTruethyThenShowQuestionsAsOptions(newOptions: Common.App.SelectOption[]) {
    this.#ifTruethyThenShowQuestionsAsOptions = newOptions
  }

  public get isCheckbox() {
    return this.#isCheckbox
  }

  public get isChoice() {
    return this.#isChoice
  }

  public get isCountable() {
    return this.#isCountable
  }

  public get isHidden() {
    return this.#isHidden
  }

  public set isHidden(newValue: boolean) {
    this.#isHidden = newValue
  }

  public get key() {
    return this.#key
  }

  public set key(newValue: string | null) {
    this.#key = newValue
  }

  public get isInput() {
    return this.#isInput
  }

  public get isRequired() {
    return this.#isRequired
  }

  public set isRequired(newValue: boolean) {
    this.#isRequired = newValue
  }

  public get isQuestion() {
    return this.#isQuestion
  }

  public get isUnlinked() {
    return this.#isUnlinked
  }

  public get questionId() {
    return this.#questionId
  }

  public get questionInputType() {
    return this.#questionInputType
  }
}
