/* eslint-disable no-underscore-dangle */

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'

/**
 * @typedef {Object} BlockProps - creates a new type named 'SpecialType'
 * @property {string} [_id]
 * @property {BlockPosition} position
 * @property {string} type
 * @property {string} value
 */

/**
 * @typedef {Object} BlockExtraProps - creates a new type named 'SpecialType'
 * @property {number} [count]
 * @property {string | null} ifSelectedThenShowQuestionId
 * @property {boolean} isCountable
 * @property {boolean} isHidden
 * @property {boolean} isMandatory
 * @property {boolean} isUnlinked
 */

/**
 * @typedef {Object} BlockPosition - creates a new type named 'SpecialType'
 * @property {number} page - a string property of SpecialType
 * @property {number} rank - a number property of SpecialType
 */

/**
 * @param {number} count
 *
 * @return {string}
 */
export const getCountLetter = count => (count + 9).toString(36).toUpperCase()

export default class Block {
  /**
   *
   * @param {BlockProps} props
   * @param {BlockExtraProps} extraProps
   */
  constructor(
    { _id, position, type, value },
    {
      count,
      ifSelectedThenShowQuestionId,
      isCountable,
      isHidden,
      isMandatory,
      isUnlinked,
      questionBlockAsOption,
      questionId,
    },
  ) {
    /** @private */
    this._count = isCountable ? count : null
    /** @private */
    this._countLetter = isCountable ? getCountLetter(count) : null
    /** @private */
    this._ifSelectedThenShowQuestionId = ifSelectedThenShowQuestionId || null
    /** @private */
    this._isChoice = type === SURVEY_BLOCK_TYPE.INPUT.CHOICE
    /**
     * @private
     *
     * @description
     * If `true`, this means that this block is an multi-blocks input, most likely a radio or select-like one.
     */
    this._isCountable = isCountable
    /** @private */
    this._isHidden = isHidden
    /** @private */
    this._isInput = type.startsWith('INPUT.')
    /** @private */
    this._isMandatory = isMandatory
    /** @private */
    this._isQuestion = type === SURVEY_BLOCK_TYPE.CONTENT.QUESTION
    /**
     * @private
     *
     * @description
     * If `true`, this means that this block is an input that can't be linked to a parent question block.
     */
    this._isUnlinked = isUnlinked
    /** @private */
    this._questionBlockAsOption = questionBlockAsOption || null
    /** @private */
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

  get count() {
    return this._count
  }

  get countLetter() {
    return this._countLetter
  }

  get ifSelectedThenShowQuestionId() {
    return this._ifSelectedThenShowQuestionId
  }

  get isChoice() {
    return this._isChoice
  }

  get isCountable() {
    return this._isCountable
  }

  get isHidden() {
    return this._isHidden
  }

  get isInput() {
    return this._isInput
  }

  get isMandatory() {
    return this._isMandatory
  }

  get isQuestion() {
    return this._isQuestion
  }

  get isUnlinked() {
    return this._isUnlinked
  }

  get questionBlockAsOption() {
    return this._questionBlockAsOption
  }

  get questionId() {
    return this._questionId
  }
}
