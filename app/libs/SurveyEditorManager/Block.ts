import { getCountLetter, isInputBlock, isQuestionBlock } from './helpers'

import type TellMe from '../../../schemas/1.0.0/TellMe'
import type { BlockConstructorOptions } from './types'

export default class Block {
  public readonly data: TellMe.BlockData
  public readonly id: string
  public readonly type: TellMe.BlockType
  public readonly value: string

  private _count: Common.Nullable<number>
  private _countLetter: Common.Nullable<string>
  private _ifTruethyThenShowQuestionIds: string[]
  private _ifTruethyThenShowQuestionsAsOptions: App.SelectOption[]
  private _isCheckbox: boolean
  private _isChoice: boolean
  private _isCountable: boolean
  private _isHidden: boolean
  private _isInput: boolean
  private _isRequired: boolean
  private _isQuestion: boolean
  private _isUnlinked: boolean
  private _questionId: Common.Nullable<string>
  private _questionInputType: Common.Nullable<string>

  constructor(
    block: TellMe.TreeBlock,
    { count, ifTruethyThenShowQuestionsAsOptions, isCountable, questionId, questionInputType }: BlockConstructorOptions,
  ) {
    this._count = isCountable && count !== undefined ? count : null
    this._countLetter = isCountable && count !== undefined ? getCountLetter(count) : null
    this._ifTruethyThenShowQuestionIds = (block.data as any).ifTruethyThenShowQuestionIds || []
    this._isCheckbox = block.type === 'input_multiple_choice'
    this._isChoice = block.type === 'input_choice'
    /**
     * @description
     * If `true`, this means that this block is an multi-blocks input, most likely a radio or select-like one.
     */
    this._isCountable = isCountable
    this._isHidden = Boolean((block.data as any).isHidden)
    this._isInput = isInputBlock(block)
    this._isRequired = Boolean((block.data as any).isRequired)
    this._isQuestion = isQuestionBlock(block)
    /**
     * @description
     * If `true`, this means that this block is an input that can't be linked to a parent question block.
     */
    this._isUnlinked = false
    this._ifTruethyThenShowQuestionsAsOptions = ifTruethyThenShowQuestionsAsOptions || []
    this._questionId = questionId
    this._questionInputType = questionInputType || null

    this.id = block.id
    this.data = block.data
    this.type = block.type
    this.value = block.value
  }

  public get count() {
    return this._count
  }

  public get countLetter() {
    return this._countLetter
  }

  public get ifTruethyThenShowQuestionIds() {
    return this._ifTruethyThenShowQuestionIds
  }

  public set ifTruethyThenShowQuestionIds(newValue: string[]) {
    this._ifTruethyThenShowQuestionIds = newValue
  }

  public get ifTruethyThenShowQuestionsAsOptions() {
    return this._ifTruethyThenShowQuestionsAsOptions
  }

  public set ifTruethyThenShowQuestionsAsOptions(newOptions: App.SelectOption[]) {
    this._ifTruethyThenShowQuestionsAsOptions = newOptions
  }

  public get isCheckbox() {
    return this._isCheckbox
  }

  public get isChoice() {
    return this._isChoice
  }

  public get isCountable() {
    return this._isCountable
  }

  public get isHidden() {
    return this._isHidden
  }

  public set isHidden(newValue: boolean) {
    this._isHidden = newValue
  }

  public get isInput() {
    return this._isInput
  }

  public get isRequired() {
    return this._isRequired
  }

  public set isRequired(newValue: boolean) {
    this._isRequired = newValue
  }

  public get isQuestion() {
    return this._isQuestion
  }

  public get isUnlinked() {
    return this._isUnlinked
  }

  public get questionId() {
    return this._questionId
  }

  public get questionInputType() {
    return this._questionInputType
  }
}
