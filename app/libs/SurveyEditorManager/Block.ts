import { getCountLetter, isInputBlock, isQuestionBlock } from './helpers'

import type { BlockConstructorOptions } from './types'
import type { TellMe } from '@schemas/1.0.0/TellMe'

export class Block {
  public readonly data: TellMe.BlockData
  public readonly id: string
  public readonly type: TellMe.BlockType
  public readonly value: string

  #count: Common.Nullable<number>
  #countLetter: Common.Nullable<string>
  #ifTruethyThenShowQuestionIds: string[]
  #ifTruethyThenShowQuestionsAsOptions: Common.App.SelectOption[]
  #isCheckbox: boolean
  #isChoice: boolean
  #isCountable: boolean
  #isHidden: boolean
  #isInput: boolean
  #isRequired: boolean
  #isQuestion: boolean
  #isUnlinked: boolean
  #questionId: Common.Nullable<string>
  #questionInputType: Common.Nullable<TellMe.BlockType>

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
    this.#isCheckbox = block.type === 'input_multiple_choice'
    this.#isChoice = block.type === 'input_choice'
    /**
     * @description
     * If `true`, this means that this block is an multi-blocks input, most likely a radio or select-like one.
     */
    this.#isCountable = isCountable
    this.#isHidden = isHidden
    this.#isInput = isInputBlock(block)
    this.#isRequired = Boolean((block.data as any).isRequired)
    this.#isQuestion = isQuestionBlock(block)
    /**
     * @description
     * If `true`, this means that this block is an input that can't be linked to a parent question block.
     */
    this.#isUnlinked = false
    this.#ifTruethyThenShowQuestionsAsOptions = ifTruethyThenShowQuestionsAsOptions || []
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
