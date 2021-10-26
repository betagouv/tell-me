/* eslint-disable no-underscore-dangle */

import mongoose from 'mongoose'
import * as R from 'ramda'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import Block from './Block'

/**
 * @typedef {Object} BlockData - creates a new type named 'SpecialType'
 * @property {string} [_id] - a string property of SpecialType
 * @property {BlockPosition} position - a number property of SpecialType
 * @property {string} type - an optional number property of SpecialType
 * @property {string} value - an optional number property of SpecialType
 */

/**
 * @typedef {Object} BlockPosition - creates a new type named 'SpecialType'
 * @property {number} page - a string property of SpecialType
 * @property {number} rank - a number property of SpecialType
 */

const INITIAL_BLOCKS = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    position: {
      page: 1,
      rank: 1,
    },
    props: {
      ifSelectedThenShowQuestionId: null,
      isHidden: false,
      isMandatory: false,
    },
    type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
    value: 'This is some free text.',
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    position: {
      page: 1,
      rank: 2,
    },
    props: {
      ifSelectedThenShowQuestionId: null,
      isHidden: false,
      isMandatory: false,
    },
    type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
    value: `What's your first question?`,
  },
]

const isBlockTypeCountable = R.flip(R.includes)([SURVEY_BLOCK_TYPE.INPUT.CHECKBOX, SURVEY_BLOCK_TYPE.INPUT.CHOICE])
const isInputBlock = R.pipe(R.prop('type'), R.startsWith('INPUT.'))
const isQuestionBlock = R.propEq('type', SURVEY_BLOCK_TYPE.CONTENT.QUESTION)

export default class SurveyManager {
  constructor(blocks = INITIAL_BLOCKS) {
    /**
     * @private
     * @type {Block[]}
     */
    this._blocks = []
    /**
     * @private
     * @type {number}
     */
    this._focusedBlockIndex = -1

    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach(key => {
      if (this[key] instanceof Function && key !== 'constructor') {
        this[key] = this[key].bind(this)
      }
    })

    this.blocks = blocks
  }

  /** @return {Block[]} blocks */
  get blocks() {
    return this._blocks
  }

  /** @return {Block[]} */
  get questionBlockAsOptions() {
    return R.pipe(
      R.filter(isQuestionBlock),
      R.map(({ _id, value }) => ({ label: value, value: _id })),
    )(this._blocks)
  }

  /** @param {BlockData} blocks */
  set blocks(blocks) {
    let isHidden = false
    let questionId = null

    this._blocks = R.reduce((previousBlocks, block) => {
      const lastBlock = R.last(previousBlocks)
      const { _id, position, props, type, value } = block
      const isCountable = isBlockTypeCountable(type)
      const isQuestion = type === SURVEY_BLOCK_TYPE.CONTENT.QUESTION
      const additionalProps = {
        ...props,
        isCountable,
      }

      if (props.ifSelectedThenShowQuestionId !== null) {
        const conditionalQuestionBlock = R.find(R.propEq('_id', props.ifSelectedThenShowQuestionId))(blocks)

        additionalProps.questionBlockAsOption = {
          label: conditionalQuestionBlock.value,
          value: conditionalQuestionBlock._id,
        }
      }

      if (isCountable) {
        if (lastBlock !== undefined && lastBlock.type === type) {
          additionalProps.count = lastBlock.count + 1
        } else {
          additionalProps.count = 1
        }
      }

      if (isQuestion) {
        isHidden = Boolean(additionalProps.isHidden)
        questionId = _id
      } else {
        additionalProps.isHidden = isHidden
      }

      additionalProps.questionId = questionId
      additionalProps.isUnlinked = false

      const normalizedBlock = new Block({ _id, position, type, value }, additionalProps)

      if (normalizedBlock.isQuestion) {
        isHidden = normalizedBlock.isHidden
      }

      return [...previousBlocks, normalizedBlock]
    }, [])(blocks)
  }

  /** @return {BlockData[]} */
  get blocksData() {
    const extractBlocksData = R.map(R.pick(['_id', 'position', 'props', 'type', 'value']))

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

  get isFocused() {
    return this._focusedBlockIndex !== -1
  }

  getQuestionTypeAt(index) {
    const maybeQuestionBlock = this.blocks[index]
    if (!isQuestionBlock(maybeQuestionBlock)) {
      throw new Error(`This survey block is not a question.`)
    }

    let nextBlockIndex = index
    const blocksLength = this.blocks.length
    // eslint-disable-next-line no-plusplus
    while (++nextBlockIndex < blocksLength) {
      const nextBlock = this.blocks[nextBlockIndex]

      if (isInputBlock(nextBlock)) {
        return nextBlock.type
      }

      if (isQuestionBlock(nextBlock)) {
        break
      }
    }

    throw new Error(`This survey question block has no related input block.`)
  }

  findBlockIndexById(id) {
    return R.findIndex(R.propEq('_id', id))(this.blocks)
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

  toggleBlockVisibilityAt(index) {
    const updatedBlock = {
      ...this.blocks[index],
      props: {
        ...this.blocks[index].props,
        isHidden: !this.blocks[index].props.isHidden,
      },
    }

    this.blocks = R.update(index, updatedBlock)(this.blocks)
  }

  setIfSelectedThenShowQuestionIdAt(index, questionBlockId) {
    const updatedBlock = {
      ...this.blocks[index],
      props: {
        ...this.blocks[index].props,
        ifSelectedThenShowQuestionId: questionBlockId,
      },
    }

    this.blocks = R.update(index, updatedBlock)(this.blocks)
  }

  addNewBlockAfterFocusedBlock(type) {
    if (!this.isFocused) {
      return
    }

    const newBlock = {
      _id: new mongoose.Types.ObjectId().toString(),
      position: {
        ...this.focusedBlock.position,
        rank: this.focusedBlock.position.rank + 1,
      },
      props: {
        ifSelectedThenShowQuestionId: null,
        isHidden: false,
        isMandatory: false,
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
    if (!this.isFocused) {
      return
    }

    this.changeBlockTypeAt(this.focusedBlockIndex, newType)
  }

  changeFocusedBlockValue(newValue) {
    if (!this.isFocused) {
      return
    }

    this.changeBlockValueAt(this.focusedBlockIndex, newValue)
  }

  removeFocusedBlock() {
    if (!this.isFocused) {
      return
    }

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

  conciliateFormData(formData) {
    return R.pipe(
      R.toPairs,
      R.map(([questionBlockId, answerOrAnswers]) => {
        const questionBlockIndex = this.findBlockIndexById(questionBlockId)
        const questionBlock = this.blocks[questionBlockIndex]
        const questionBlockType = this.getQuestionTypeAt(questionBlockIndex)

        return {
          question: questionBlock.value,
          type: questionBlockType,
          values: Array.isArray(answerOrAnswers) ? answerOrAnswers : [answerOrAnswers],
        }
      }),
    )(formData)
  }
}
