/* eslint-disable no-underscore-dangle */

// import * as R from 'ramda'

// import { SURVEY_BLOCK_TYPE } from '../constants'

export const getCountLetter = count => (count + 9).toString(36).toUpperCase()

export default class Block {
  constructor({ position, type, value }, { count, isCountable }) {
    this.position = position
    this.type = type
    this.value = value

    this._isCountable = isCountable
    this._count = isCountable ? count : null
    this._countLetter = isCountable ? getCountLetter(count) : null
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
