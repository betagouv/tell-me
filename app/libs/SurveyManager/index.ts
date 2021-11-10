/* eslint-disable @typescript-eslint/naming-convention */
import mongoose from 'mongoose'
import * as R from 'ramda'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import Block, { BlockConstructorOptions } from './Block'

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
      isMandatory: true,
    },
    type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
    value: `What's your first question?`,
  },
]

const isBlockTypeCountable = R.flip(R.includes)([
  SURVEY_BLOCK_TYPE.INPUT.CHECKBOX,
  SURVEY_BLOCK_TYPE.INPUT.CHOICE,
]) as any
const isInputBlock = R.pipe(R.prop<Block['type']>('type'), R.startsWith('INPUT.'))
const isQuestionBlock = R.propEq<Block['type']>('type', SURVEY_BLOCK_TYPE.CONTENT.QUESTION)

export default class SurveyManager {
  private _blocks: Block[]
  private _focusedBlockIndex: number

  constructor(blocks = INITIAL_BLOCKS) {
    this._blocks = []
    this._focusedBlockIndex = -1

    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach(key => {
      if (this[key] instanceof Function && key !== 'constructor') {
        this[key] = this[key].bind(this)
      }
    })

    this.blocks = blocks
  }

  public get blocks(): Block[] {
    return this._blocks
  }

  public get questionBlockAsOptions(): App.SelectOption[] {
    return R.pipe<any, any, any>(
      R.filter(isQuestionBlock),
      R.map(({ _id, value }) => ({ label: value, value: _id })),
    )(this._blocks) as App.SelectOption[]
  }

  set blocks(blocks: Api.Model.Survey.Block[]) {
    let isHidden = false
    let questionId: Common.Nullable<string> = null

    this._blocks = R.reduce((previousBlocks, block) => {
      const lastBlock = R.last<Block>(previousBlocks)
      const { _id, position, props, type, value } = block as Api.Model.Survey.Block
      const isCountable = isBlockTypeCountable(type) as boolean
      const isQuestion = type === SURVEY_BLOCK_TYPE.CONTENT.QUESTION
      const additionalProps = {
        ...props,
        isCountable,
      } as BlockConstructorOptions

      if (props.ifSelectedThenShowQuestionId !== null) {
        const conditionalQuestionBlock = R.find<Api.Model.Survey.Block>(
          R.propEq('_id', props.ifSelectedThenShowQuestionId),
        )(blocks)

        if (typeof conditionalQuestionBlock === 'undefined') {
          throw new Error(`This should never happen.`)
        }

        additionalProps.questionBlockAsOption = {
          label: conditionalQuestionBlock.value,
          value: conditionalQuestionBlock._id,
        }
      }

      if (isCountable) {
        if (lastBlock !== undefined && lastBlock.type === type && lastBlock.count !== null) {
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

  public get blocksData(): Api.Model.Survey.Block[] {
    const extractBlocksData = R.map(R.pick(['_id', 'position', 'props', 'type', 'value']))

    return extractBlocksData(this._blocks)
  }

  public get focusedBlock(): Common.Nullable<Block> {
    if (this._focusedBlockIndex < 0) {
      return null
    }

    return this._blocks[this._focusedBlockIndex]
  }

  public get focusedBlockIndex(): number {
    return this._focusedBlockIndex
  }

  public get isFocused(): boolean {
    return this._focusedBlockIndex !== -1
  }

  getQuestionTypeAt(index: number): string {
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

  findBlockIndexById(id: string): number {
    return R.findIndex(R.propEq('_id', id))(this.blocks)
  }

  changeBlockTypeAt(index: number, newType: string): void {
    const updatedBlock = {
      ...this.blocks[index],
      type: newType,
    }

    this.blocks = R.update(index, updatedBlock)(this.blocks)

    this.changeBlockPropsAt(index, {
      isMandatory: newType === SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
    })
  }

  changeBlockValueAt(index: number, newValue: string): void {
    const updatedBlock = {
      ...this.blocks[index],
      value: newValue,
    }

    this.blocks = R.update(index, updatedBlock)(this.blocks)
  }

  changeBlockPropsAt(index: number, newProps: Partial<Api.Model.Survey.BlockProps>): void {
    const updatedBlock = {
      ...this.blocks[index],
      props: {
        ...this.blocks[index].props,
        ...newProps,
      },
    }

    this.blocks = R.update(index, updatedBlock)(this.blocks)
  }

  toggleBlockObligationAt(index: number): void {
    this.changeBlockPropsAt(index, {
      isMandatory: !this.blocks[index].props.isMandatory,
    })
  }

  toggleBlockVisibilityAt(index: number): void {
    this.changeBlockPropsAt(index, {
      isHidden: !this.blocks[index].props.isHidden,
    })
  }

  setIfSelectedThenShowQuestionIdAt(index: number, questionBlockId: string): void {
    const updatedBlock = {
      ...this.blocks[index],
      props: {
        ...this.blocks[index].props,
        ifSelectedThenShowQuestionId: questionBlockId,
      },
    } as Block

    this.blocks = R.update(index, updatedBlock)(this.blocks)
  }

  addNewBlockAfterFocusedBlock(type: string) {
    if (!this.isFocused || this.focusedBlock === null) {
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
        isMandatory: type === SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
      },
      type,
      value: '',
    }

    this.blocks = R.pipe<any, any, any>(
      R.insert(this.focusedBlockIndex + 1, newBlock),
      R.reduce((previousBlocks: Block[], block: Block) => {
        const { position } = block
        if (position.page !== newBlock.position.page || previousBlocks.length === 0) {
          return [...previousBlocks, block]
        }

        const previousBlock = R.last<Block>(previousBlocks)
        const previousRank = typeof previousBlock === 'undefined' ? 0 : previousBlock.position.rank
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

  changeFocusedBlockType(newType: string) {
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

  changeFocusedBlockProps(newProps: Api.Model.Survey.BlockProps) {
    if (!this.isFocused) {
      return
    }

    this.changeBlockPropsAt(this.focusedBlockIndex, newProps)
  }

  removeFocusedBlock(): void {
    if (!this.isFocused) {
      return
    }

    const oldBlock = this.focusedBlock
    if (oldBlock === null) {
      return
    }

    this.blocks = R.reduce<any, any>((newBlocks, block) => {
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

  setFocusAt(index): void {
    this._focusedBlockIndex = index
  }

  focusPreviousBlock(): void {
    if (this._focusedBlockIndex < 0) {
      return
    }

    this._focusedBlockIndex -= 1
  }

  focusNextBlock(): void {
    if (this._focusedBlockIndex >= this._blocks.length - 1) {
      return
    }

    this._focusedBlockIndex += 1
  }

  unsetFocus(): void {
    this._focusedBlockIndex = -1
  }

  conciliateFormData(formData): Array<{
    question: string
    type: string
    values: string[]
  }> {
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
