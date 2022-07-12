import { B } from 'bhala'

import { getFieldVisibilityConditionsFromPreviousFields } from './helpers/getFieldVisibilityConditionsFromPreviousFields'

import type { FieldInterface, FieldVisibilityCondition } from './types'
import type { TellMe } from '@schemas/1.0.0/TellMe'

export class Field implements FieldInterface {
  #answer: TellMe.Answer | undefined
  #id: string
  #inputBlocks: TellMe.InputBlock[]
  #inputType: TellMe.InputBlock['type'] | undefined
  #isVisible: boolean
  #rawValue: string | undefined
  #type: TellMe.Answer['type'] | undefined
  /** Conditions to fulfill in order to make this field visible if it is hidden by default. */
  #visibilityConditions: FieldVisibilityCondition[]

  readonly #question: TellMe.Question
  readonly #questionBlock: TellMe.QuestionBlock

  constructor(questionBlock: TellMe.QuestionBlock, previousFields: Field[]) {
    this.#id = questionBlock.id
    this.#inputBlocks = []
    this.#isVisible = questionBlock.data.isHidden
    this.#question = Field.#getQuestionFromQuestionBlock(questionBlock)
    this.#questionBlock = questionBlock
    this.#visibilityConditions = getFieldVisibilityConditionsFromPreviousFields(questionBlock.id, previousFields)
  }

  get answer(): TellMe.Answer | undefined {
    if (!this.#type) {
      return undefined
    }

    return this.#answer
  }

  get inputBlocks(): TellMe.InputBlock[] {
    return this.#inputBlocks
  }

  set inputBlock(inputBlock: TellMe.InputBlock) {
    if (!this.#type) {
      switch (inputBlock.type) {
        case 'input_email':
          this.#type = 'email'
          break

        case 'input_file':
          this.#type = 'file'
          break

        case 'input_link':
          this.#type = 'link'
          break

        case 'input_phone':
          this.#type = 'phone'
          break

        case 'input_rating':
          this.#type = 'score'
          break

        case 'input_checkbox':
        case 'input_choice':
        case 'input_linear_scale':
        case 'input_long_answer':
        case 'input_number':
        case 'input_short_answer':
          this.#type = 'string'
          break

        case 'input_multiple_choice':
          this.#type = 'strings'
          break

        default:
          B.error(
            '[app/libs/SurveyFormManager/Field.inputBlock]',
            `Unable to resolve \`this.#type\` (= ${inputBlock.type}).`,
          )
          break
      }
    }

    this.#inputBlocks.push(inputBlock)
  }

  get inputType(): TellMe.InputBlock['type'] | undefined {
    return this.#inputType
  }

  /** Is this question currently hidden on the Survey Form or not? */
  get isVisible(): boolean {
    return this.#isVisible
  }

  set isVisible(newValue: boolean) {
    this.#isVisible = newValue
  }

  get type(): TellMe.Answer['type'] | undefined {
    return this.#type
  }

  static #getQuestionFromQuestionBlock(questionBlock: TellMe.QuestionBlock): TellMe.Question {
    return {
      id: questionBlock.id,
      key: questionBlock.data.key,
      value: questionBlock.value,
    }
  }
}
