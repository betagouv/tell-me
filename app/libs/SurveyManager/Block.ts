import { SURVEY_BLOCK_TYPE } from '../../../common/constants'

interface GetCountLetter {
  (count: number): string
}

export const getCountLetter: GetCountLetter = count => (count + 9).toString(36).toUpperCase()

export default class Block {
  public readonly _id: string
  public readonly position: Api.Model.Block.Position
  public readonly type: string
  public readonly value: string
  public readonly props: Api.Model.Block.Props

  private _count: number | null
  private _countLetter: string | null
  private _ifSelectedThenShowQuestionId: string | null
  private _isCheckbox: boolean
  private _isChoice: boolean
  private _isCountable: boolean
  private _isHidden: boolean
  private _isInput: boolean
  private _isMandatory: boolean
  private _isQuestion: boolean
  private _isUnlinked: boolean
  private _questionBlockAsOption: App.SelectOption | null
  private _questionId: string

  constructor(
    {
      _id,
      position,
      type,
      value,
    }: {
      _id: string
      position: Api.Model.Block.Position
      type: string
      value: string
    },
    {
      count,
      ifSelectedThenShowQuestionId,
      isCountable,
      isHidden,
      isMandatory,
      isUnlinked,
      questionBlockAsOption,
      questionId,
    }: {
      count?: number
      ifSelectedThenShowQuestionId?: string
      isCountable: boolean
      isHidden: boolean
      isMandatory: boolean
      isUnlinked: boolean
      questionBlockAsOption?: App.SelectOption
      questionId: string
    },
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
}
