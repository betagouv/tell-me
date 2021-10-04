/* eslint-disable no-underscore-dangle */

import * as R from 'ramda'

import { SURVEY_BLOCK_TYPE } from '../constants'
import Block from './Block'

const INITIAL_BLOCKS = [
  {
    position: {
      page: 1,
      rank: 1,
    },
    type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
    value: 'This is some free text.',
  },
  {
    position: {
      page: 1,
      rank: 2,
    },
    type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
    value: `What's your first question?`,
  },
]

const extractBlocksData = R.map(R.pick(['position', 'type', 'value']))
const isBlockTypeCountable = R.flip(R.includes)([SURVEY_BLOCK_TYPE.INPUT.CHECKBOX, SURVEY_BLOCK_TYPE.INPUT.CHOICE])

export default class SurveyBlocksManager {
  constructor(blocks = INITIAL_BLOCKS) {
    this.blocks = blocks

    this.unsetFocus()

    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach(key => {
      if (this[key] instanceof Function && key !== 'constructor') {
        this[key] = this[key].bind(this)
      }
    })
  }

  get blocks() {
    return this._blocks
  }

  set blocks(blocks) {
    this._blocks = R.reduce((previousBlocks, block) => {
      const lastBlock = R.last(previousBlocks)
      const { position, type, value } = block
      const isCountable = isBlockTypeCountable(type)
      const additionalProps = {
        isCountable,
      }

      if (isCountable) {
        if (lastBlock !== undefined && lastBlock.type === type) {
          additionalProps.count = lastBlock.count + 1
        } else {
          additionalProps.count = 1
        }
      }

      const normalizedBlock = new Block({ position, type, value }, additionalProps)

      return [...previousBlocks, normalizedBlock]
    }, [])(blocks)
  }

  get blocksData() {
    return extractBlocksData(this._blocks)
  }

  get focusedBlock() {
    if (this._focusedBlockIndex < 0) {
      return null
    }

    return this._blocks[this._focusedBlockIndex]
  }

  get focusedBlockIndex() {
    return this._focusedBlockIndex
  }

  changeBlockTypeAt(index, newType) {
    const updatedBlock = {
      ...this.blocks[index],
      type: newType,
    }

    this.blocks = R.update(index, updatedBlock)(this.blocks)
  }

  changeBlockValueAt(index, newValue) {
    const updatedBlock = {
      ...this.blocks[index],
      value: newValue,
    }

    this.blocks = R.update(index, updatedBlock)(this.blocks)
  }

  addNewBlockAfterFocusedBlock(type) {
    const newBlock = {
      position: {
        ...this.focusedBlock.position,
        rank: this.focusedBlock.position.rank + 1,
      },
      type,
      value: '',
    }

    this.blocks = R.pipe(
      R.insert(this.focusedBlockIndex + 1, newBlock),
      R.reduce((previousBlocks, block) => {
        const { position } = block
        if (position.page !== newBlock.position.page || previousBlocks.length === 0) {
          return [...previousBlocks, block]
        }

        const previousRank = R.last(previousBlocks).position.rank
        if (position.rank === previousRank + 1) {
          return [...previousBlocks, block]
        }

        const normalizedBlock = {
          ...block,
          position: {
            ...position,
            rank: previousRank + 1,
          },
        }

        return [...previousBlocks, normalizedBlock]
      }, []),
    )(this.blocks)

    this.focusNextBlock()
  }

  changeFocusedBlockType(newType) {
    this.changeBlockTypeAt(this.focusedBlockIndex, newType)
  }

  changeFocusedBlockValue(newValue) {
    this.changeBlockValueAt(this.focusedBlockIndex, newValue)
  }

  removeFocusedBlock() {
    const oldBlock = this.focusedBlock

    this.blocks = R.reduce((newBlocks, block) => {
      const { position } = block
      if (position.page !== oldBlock.position.page || position.rank < oldBlock.position.rank) {
        return [...newBlocks, block]
      }

      if (R.equals(position, oldBlock.position)) {
        return newBlocks
      }

      const updatedBlock = {
        ...block,
        position: {
          ...position,
          rank: position.rank - 1,
        },
      }

      return [...newBlocks, updatedBlock]
    }, [])(this.blocks)

    this.focusPreviousBlock()
  }

  setFocusAt(index) {
    this._focusedBlockIndex = index
  }

  focusPreviousBlock() {
    if (this._focusedBlockIndex < 0) {
      return
    }

    this._focusedBlockIndex -= 1
  }

  focusNextBlock() {
    if (this._focusedBlockIndex >= this._blocks.length - 1) {
      return
    }

    this._focusedBlockIndex += 1
  }

  unsetFocus() {
    this._focusedBlockIndex = -1
  }
}
