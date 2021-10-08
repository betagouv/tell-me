/* eslint-disable no-underscore-dangle */

// import * as R from 'ramda'

// import { SURVEY_BLOCK_TYPE } from '../constants'

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
 * @property {boolean} isCountable
 */

/**
 * @typedef {Object} BlockPosition - creates a new type named 'SpecialType'
 * @property {number} page - a string property of SpecialType
 * @property {number} rank - a number property of SpecialType
 */

export const getCountLetter = count => (count + 9).toString(36).toUpperCase()

export default class Block {
  /**
   *
   * @param {BlockProps} props
   * @param {BlockExtraProps} extraProps
   */
  constructor({ _id, position, type, value }, { count, isCountable }) {
    /** @private */
    this._isCountable = isCountable
    /** @private */
    this._count = isCountable ? count : null
    /** @private */
    this._countLetter = isCountable ? getCountLetter(count) : null

    this.id = _id

    this.position = position
    this.type = type
    this.value = value
  }

  get count() {
    return this._count
  }

  get countLetter() {
    return this._countLetter
  }

  get isCountable() {
    return this._isCountable
  }
}
