import { SURVEY_BLOCK_TYPE } from '../../../common/constants'

interface GetCountLetter {
  (count: number): string
}
export const getCountLetter: GetCountLetter = count => (count + 9).toString(36).toUpperCase()

export type BlockConstructorData = Omit<Api.Model.Survey.BlockLegacy, 'props'>

export type BlockConstructorOptions = {
  count?: number
  ifSelectedThenShowQuestionId?: string
  isCountable: boolean
  isHidden: boolean
  isMandatory: boolean
  isUnlinked: boolean
  questionBlockAsOption?: App.SelectOption
  questionId: Common.Nullable<string>
  questionInputType?: string
}

export default class Block {
  public readonly _id: string
  public readonly position: Api.Model.Survey.BlockPosition
  public readonly type: string
  public readonly value: string
  public readonly props: Api.Model.Survey.BlockPropsLegacy

  private _count: Common.Nullable<number>
  private _countLetter: Common.Nullable<string>
  private _ifSelectedThenShowQuestionId: Common.Nullable<string>
  private _isCheckbox: boolean
  private _isChoice: boolean
  private _isCountable: boolean
  private _isHidden: boolean
  private _isInput: boolean
  private _isMandatory: boolean
  private _isQuestion: boolean
  private _isUnlinked: boolean
  private _questionBlockAsOption: Common.Nullable<App.SelectOption>
  private _questionId: Common.Nullable<string>
  private _questionInputType: Common.Nullable<string>

  constructor(
    { _id, position, type, value }: BlockConstructorData,
    {
      count,
      ifSelectedThenShowQuestionId,
      isCountable,
      isHidden,
      isMandatory,
      isUnlinked,
      questionBlockAsOption,
      questionId,
      questionInputType,
    }: BlockConstructorOptions,
  ) {
    this._count = isCountable && count !== undefined ? count : null
    this._countLetter = isCountable && count !== undefined ? getCountLetter(count) : null
    this._ifSelectedThenShowQuestionId = ifSelectedThenShowQuestionId || null
    this._isCheckbox = type === SURVEY_BLOCK_TYPE.INPUT.CHECKBOX
    this._isChoice = type === SURVEY_BLOCK_TYPE.INPUT.CHOICE
    /**
     * @description
     * If `true`, this means that this block is an multi-blocks input, most likely a radio or select-like one.
     */
    this._isCountable = isCountable
    this._isHidden = isHidden
    this._isInput = type.startsWith('INPUT.')
    this._isMandatory = isMandatory
    this._isQuestion = type === SURVEY_BLOCK_TYPE.CONTENT.QUESTION
    /**
     * @description
     * If `true`, this means that this block is an input that can't be linked to a parent question block.
     */
    this._isUnlinked = isUnlinked
    this._questionBlockAsOption = questionBlockAsOption || null
    this._questionId = questionId
    this._questionInputType = questionInputType || null

    this._id = _id

    this.position = position
    this.type = type
    this.value = value

    this.props = {
      ifSelectedThenShowQuestionId: this._ifSelectedThenShowQuestionId,
      isHidden: this._isHidden,
      isMandatory: this._isMandatory,
    }
  }

  public get count() {
    return this._count
  }

  public get countLetter() {
    return this._countLetter
  }

  public get ifSelectedThenShowQuestionId() {
    return this._ifSelectedThenShowQuestionId
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

  public get isInput() {
    return this._isInput
  }

  public get isMandatory() {
    return this._isMandatory
  }

  public get isQuestion() {
    return this._isQuestion
  }

  public get isUnlinked() {
    return this._isUnlinked
  }

  public get questionBlockAsOption() {
    return this._questionBlockAsOption
  }

  public get questionId() {
    return this._questionId
  }

  public get questionInputType() {
    return this._questionInputType
  }
}
