/* eslint-disable @typescript-eslint/naming-convention */
import mongoose from 'mongoose'
import * as R from 'ramda'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import Block, { BlockConstructorOptions } from './Block'

const INITIAL_BLOCKS: Api.Model.Survey.BlockLegacy[] = [
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

const isBlockTypeCountable: (type: string) => boolean = R.flip(R.includes)([
  SURVEY_BLOCK_TYPE.INPUT.CHECKBOX,
  SURVEY_BLOCK_TYPE.INPUT.CHOICE,
]) as any
const isInputBlock: (block: Api.Model.Survey.BlockLegacy) => boolean = R.pipe(R.prop('type'), R.startsWith('INPUT.'))
const isQuestionBlock: (block: Api.Model.Survey.BlockLegacy) => boolean = R.propEq(
  'type',
  SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
)

const getQuestionInputTypeAt = (blocks: Api.Model.Survey.BlockLegacy[], index: number): string | undefined => {
  const maybeQuestionBlock = blocks[index]
  if (!isQuestionBlock(maybeQuestionBlock)) {
    return undefined
  }

  let nextBlockIndex = index
  const blocksLength = blocks.length
  // eslint-disable-next-line no-plusplus
  while (++nextBlockIndex < blocksLength) {
    const nextBlock = blocks[nextBlockIndex]

    if (isInputBlock(nextBlock)) {
      return nextBlock.type
    }

    if (isQuestionBlock(nextBlock)) {
      break
    }
  }

  return undefined
}

export default class LegacySurveyManager {
  private _blocks: Block[]
  private _focusedBlockIndex: number

  public get blocks(): Block[] {
    return this._blocks
  }

  public set blocks(blocks: Api.Model.Survey.BlockLegacy[]) {
    let isHidden = false
    let questionId: Common.Nullable<string> = null

    this._blocks = (R.addIndex(R.reduce)<any>((previousBlocks, block, index) => {
      const lastBlock = R.last<Block>(previousBlocks)
      const { _id, position, props, type, value } = block as Api.Model.Survey.BlockLegacy
      const isCountable = isBlockTypeCountable(type)
      const isQuestion = type === SURVEY_BLOCK_TYPE.CONTENT.QUESTION
      const additionalProps: Record<string, any> = {
        ...props,
        isCountable,
      }

      if (props.ifSelectedThenShowQuestionId !== null) {
        const conditionalQuestionBlock = R.find<Api.Model.Survey.BlockLegacy>(
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

        additionalProps.questionInputType = getQuestionInputTypeAt(blocks, index)
      } else {
        additionalProps.isHidden = isHidden
      }

      additionalProps.questionId = questionId
      additionalProps.isUnlinked = false

      const normalizedBlock = new Block({ _id, position, type, value }, additionalProps as BlockConstructorOptions)

      if (normalizedBlock.isQuestion) {
        isHidden = normalizedBlock.isHidden
      }

      return [...previousBlocks, normalizedBlock]
    }, [])(blocks as any) as unknown) as Block[]
  }

  public get blocksData(): Api.Model.Survey.BlockLegacy[] {
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

  public get questionBlockAsOptions(): App.SelectOption[] {
    return R.pipe<any, any, any>(
      R.filter(isQuestionBlock),
      R.map(({ _id, value }) => ({ label: value, value: _id })),
    )(this._blocks) as App.SelectOption[]
  }

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

  /**
   * @description
   * If `index=-1`, the new block is prepended to the first block.
   */
  public appendNewBlockAt(index: number, type: string): void {
    if (index !== -1 && this.blocks[index] === undefined) {
      return
    }

    const newBlock = {
      _id: new mongoose.Types.ObjectId().toString(),
      position: {
        page: index === -1 ? 1 : this.blocks[index].position.page,
        rank: index === -1 ? 1 : this.blocks[index].position.rank + 1,
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
      R.insert(index + 1, newBlock),
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

        const repositionedBlock = {
          ...block,
          position: {
            ...position,
            rank: previousRank + 1,
          },
        }

        return [...previousBlocks, repositionedBlock]
      }, []),
    )(this.blocks)

    this.setFocusAt(index + 1)
  }

  public appendNewBlockToFocusedBlock(type: string) {
    if (!this.isFocused) {
      return
    }

    this.appendNewBlockAt(this.focusedBlockIndex, type)
  }

  public changeBlockTypeAt(index: number, newType: string): void {
    const updatedBlock = {
      ...this.blocks[index],
      type: newType,
    }

    this.blocks = R.update(index, updatedBlock)(this.blocks)

    this.changeBlockPropsAt(index, {
      isMandatory: newType === SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
    })
  }

  public changeBlockValueAt(index: number, newValue: string): void {
    const updatedBlock = {
      ...this.blocks[index],
      value: newValue,
    }

    this.blocks = R.update(index, updatedBlock)(this.blocks)
  }

  public changeBlockPropsAt(index: number, newProps: Partial<Api.Model.Survey.BlockPropsLegacy>): void {
    const updatedBlock = {
      ...this.blocks[index],
      props: {
        ...this.blocks[index].props,
        ...newProps,
      },
    }

    this.blocks = R.update(index, updatedBlock)(this.blocks)
  }

  public changeFocusedBlockType(newType: string): void {
    if (!this.isFocused) {
      return
    }

    this.changeBlockTypeAt(this.focusedBlockIndex, newType)
  }

  public changeFocusedBlockValue(newValue): void {
    if (!this.isFocused) {
      return
    }

    this.changeBlockValueAt(this.focusedBlockIndex, newValue)
  }

  public changeFocusedBlockProps(newProps: Api.Model.Survey.BlockPropsLegacy): void {
    if (!this.isFocused) {
      return
    }

    this.changeBlockPropsAt(this.focusedBlockIndex, newProps)
  }

  public conciliateFormData(formData: {
    [questionBlockId: string]: string | string[]
  }): Array<{
    question: string
    type: string
    values: string[]
  }> {
    return R.pipe(
      R.toPairs,
      R.map(([questionBlockId, answerOrAnswers]) => {
        const questionBlockIndex = this.findBlockIndexById(questionBlockId)
        const questionBlock = this.blocks[questionBlockIndex]
        const questionInputType = getQuestionInputTypeAt(this.blocks, questionBlockIndex)
        if (questionInputType === undefined) {
          throw new Error(`This question should have an input type.`)
        }

        return {
          question: questionBlock.value,
          type: questionInputType,
          values: Array.isArray(answerOrAnswers) ? answerOrAnswers : [answerOrAnswers],
        }
      }),
    )(formData)
  }

  public getQuestionInputTypeAt(index: number): string {
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

  public findBlockIndexById(id: string): number {
    return R.findIndex(R.propEq('_id', id))(this.blocks)
  }

  public focusNextBlock(): void {
    if (this.focusedBlockIndex >= this.blocks.length - 1) {
      return
    }

    this.setFocusAt(this.focusedBlockIndex + 1)
  }

  public focusPreviousBlock(): void {
    if (this.focusedBlockIndex < 0) {
      return
    }

    this.setFocusAt(this.focusedBlockIndex - 1)
  }

  public removeBlockAt(index: number): void {
    const oldBlock = this.blocks[index]
    if (oldBlock === undefined) {
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

    if (index === this.focusedBlockIndex) {
      this.focusPreviousBlock()
    }
  }

  public removeFocusedBlock(): void {
    if (!this.isFocused) {
      return
    }

    this.removeBlockAt(this.focusedBlockIndex)
  }

  public setFocusAt(index = -1): void {
    this._focusedBlockIndex = index
  }

  public setIfSelectedThenShowQuestionIdAt(index: number, questionBlockId: Common.Nullable<string>): void {
    const updatedBlock = {
      ...this.blocks[index],
      props: {
        ...this.blocks[index].props,
        ifSelectedThenShowQuestionId: questionBlockId,
      },
    } as Block

    this.blocks = R.update(index, updatedBlock)(this.blocks)
  }

  public toggleBlockObligationAt(index: number): void {
    this.changeBlockPropsAt(index, {
      isMandatory: !this.blocks[index].props.isMandatory,
    })
  }

  public toggleBlockVisibilityAt(index: number): void {
    this.changeBlockPropsAt(index, {
      isHidden: !this.blocks[index].props.isHidden,
    })
  }

  public unsetFocus(): void {
    this.setFocusAt()
  }
}
