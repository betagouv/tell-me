import cuid from 'cuid'
import * as R from 'ramda'

import generateTellMeTreeChildren from '../../helpers/generateTellMeTreeChildren'
import Block from './Block'
import { getQuestionInputTypeAt, isBlockCountable, isInputBlock, isQuestionBlock } from './helpers'

import type TellMe from '../../../schemas/1.0.0/TellMe'
import type { BlockConstructorOptions } from './types'

const INITIAL_BLOCKS: TellMe.TreeBlock[] = [
  {
    data: {
      pageIndex: 0,
      pageRankIndex: 0,
    },
    id: cuid(),
    type: 'content_text',
    value: 'This is some free text.',
  },
  {
    data: {
      isHidden: false,
      isRequired: true,
      pageIndex: 0,
      pageRankIndex: 1,
    },
    id: cuid(),
    type: 'question',
    value: `What's your first question?`,
  },
]

export default class SurveyEditorManager {
  private _blocks: Block[]
  private _focusedBlockIndex: number

  public get blocks() {
    return this._blocks
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

  public get questionBlocksAsOptions(): Common.App.SelectOption[] {
    return R.pipe<any, any, any>(
      R.filter(isQuestionBlock),
      R.map(({ id, value }) => ({ label: value, value: id })),
    )(this._blocks) as Common.App.SelectOption[]
  }

  constructor(initialBlocks: TellMe.TreeBlock[] = INITIAL_BLOCKS) {
    this._blocks = []
    this._focusedBlockIndex = -1

    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach(key => {
      if (this[key] instanceof Function && key !== 'constructor') {
        this[key] = this[key].bind(this)
      }
    })

    this.initializeBlocks(initialBlocks)
  }

  /**
   * @description
   * If `index=-1`, the new block is prepended to the first block.
   */
  public appendNewBlockAt(index: number, type: TellMe.BlockType): void {
    if (index !== -1 && this._blocks[index] === undefined) {
      return
    }

    const newBlock = {
      data: {
        pageIndex: index === -1 ? 0 : this.blocks[index].data.pageIndex,
        pageRankIndex: index === -1 ? 0 : this.blocks[index].data.pageRankIndex + 1,
      },
      id: cuid(),
      type,
      value: '',
    }

    if (isQuestionBlock(newBlock)) {
      ;(newBlock as TellMe.QuestionBlock).data.isHidden = false
      ;(newBlock as TellMe.QuestionBlock).data.isRequired = true
    }

    if (isInputBlock(newBlock)) {
      ;(newBlock as TellMe.InputBlock).data.ifTruethyThenShowQuestionIds = []
    }

    const blocksAsTellMeTreeBlocks = generateTellMeTreeChildren(this._blocks)

    this.initializeBlocks(
      R.pipe<any, any, any>(
        R.insert(index + 1, newBlock),
        R.reduce((previousBlocks: TellMe.TreeBlock[], block: TellMe.TreeBlock) => {
          const { data } = block
          if (data.pageIndex !== newBlock.data.pageIndex || previousBlocks.length === 0) {
            return [...previousBlocks, block]
          }

          const previousBlock = R.last(previousBlocks)
          const previousRank = typeof previousBlock === 'undefined' ? 0 : previousBlock.data.pageRankIndex
          if (data.pageRankIndex === previousRank + 1) {
            return [...previousBlocks, block]
          }

          const repositionedBlock: TellMe.TreeBlock = Object.assign(block, {
            data: {
              ...data,
              pageRankIndex: previousRank + 1,
            },
          })

          return [...previousBlocks, repositionedBlock]
        }, []),
      )(blocksAsTellMeTreeBlocks),
    )

    this.setFocusAt(index + 1)
  }

  public appendNewBlockToFocusedBlock(type: TellMe.BlockType) {
    if (!this.isFocused) {
      return
    }

    this.appendNewBlockAt(this.focusedBlockIndex, type)
  }

  public changeBlockTypeAt(index: number, newType: TellMe.BlockType): void {
    const treeBlocks = generateTellMeTreeChildren(this._blocks)

    const treeBlock = { ...treeBlocks[index] }

    const updatedTreeBlock = {
      data: {
        pageIndex: treeBlock.data.pageIndex,
        pageRankIndex: treeBlock.data.pageRankIndex,
      },
      id: treeBlock.id,
      type: newType,
      value: treeBlock.value,
    }

    if (isQuestionBlock(updatedTreeBlock)) {
      ;(updatedTreeBlock as TellMe.QuestionBlock).data.isHidden = false
      ;(updatedTreeBlock as TellMe.QuestionBlock).data.isRequired = true
    }

    if (isInputBlock(updatedTreeBlock)) {
      ;(updatedTreeBlock as TellMe.InputBlock).data.ifTruethyThenShowQuestionIds = []
    }

    const nextTreeBlocks = R.update(index, updatedTreeBlock)(treeBlocks) as TellMe.TreeBlock[]

    this.initializeBlocks(nextTreeBlocks)
  }

  public changeBlockPropsAt(index: number, newProps: Partial<Block>): void {
    const updatedBlock = Object.assign(this.blocks[index], newProps)

    this._blocks = R.update(index, updatedBlock)(this._blocks)
  }

  public changeBlockValueAt(index: number, newValue: string): void {
    const updatedBlock = Object.assign(this.blocks[index], {
      value: newValue,
    })

    this._blocks = R.update(index, updatedBlock)(this._blocks)
  }

  public changeFocusedBlockType(newType: TellMe.BlockType): void {
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

  public getQuestionInputTypeAt(index: number): TellMe.BlockType {
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
    return R.findIndex(R.propEq('id', id))(this.blocks)
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

    this._blocks = this._blocks.reduce((newBlocks: Block[], block: Block) => {
      const { data } = block
      if (data.pageIndex !== oldBlock.data.pageIndex || data.pageRankIndex < oldBlock.data.pageRankIndex) {
        return [...newBlocks, block]
      }

      if (R.equals(data, oldBlock.data)) {
        return newBlocks
      }

      const updatedBlock = Object.assign(block, {
        data: {
          ...data,
          pageRankIndex: data.pageRankIndex - 1,
        },
      })

      return [...newBlocks, updatedBlock]
    }, [])

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

  public setIfSelectedThenShowQuestionIdsAt(index: number, questionBlockIds: string[]): void {
    const questionBlocksAsOptions = questionBlockIds
      .map(questionBlockId => this.findBlockIndexById(questionBlockId))
      .map(questionBlockIndex => this._blocks[questionBlockIndex])
      .map(questionBlock => ({
        label: questionBlock.value,
        value: questionBlock.id,
      }))

    const updatedBlock = Object.assign(this.blocks[index], {
      ifTruethyThenShowQuestionIds: questionBlockIds,
      ifTruethyThenShowQuestionsAsOptions: questionBlocksAsOptions,
    })

    this._blocks = R.update(index, updatedBlock)(this._blocks)
  }

  public toggleBlockObligationAt(index: number): void {
    this.changeBlockPropsAt(index, {
      isRequired: !this.blocks[index].isRequired,
    })
  }

  public toggleBlockVisibilityAt(index: number): void {
    this.changeBlockPropsAt(index, {
      isHidden: !this.blocks[index].isHidden,
    })
  }

  public unsetFocus(): void {
    this.setFocusAt()
  }

  private initializeBlocks(blocks: TellMe.TreeBlock[]) {
    let questionId: Common.Nullable<string> = null

    this._blocks = blocks.reduce((previousBlocks: Block[], block: TellMe.TreeBlock, index: number) => {
      const lastBlock = R.last<Block>(previousBlocks)
      const { data } = block as TellMe.TreeBlock
      const isCountable = isBlockCountable(block)
      const isQuestion = isQuestionBlock(block)
      const isInput = isInputBlock(block)
      const additionalProps: Partial<BlockConstructorOptions> = {
        ...data,
        isCountable,
      }

      if (isInput && (block as TellMe.InputBlock).data.ifTruethyThenShowQuestionIds.length > 0) {
        additionalProps.ifTruethyThenShowQuestionsAsOptions = blocks
          .filter(
            _block =>
              isQuestionBlock(_block) &&
              (block as TellMe.InputBlock).data.ifTruethyThenShowQuestionIds.includes(_block.id),
          )
          .map(_block => ({
            label: _block.value,
            value: _block.id,
          }))
      }

      if (isCountable) {
        if (lastBlock !== undefined && lastBlock.type === block.type && lastBlock.count !== null) {
          additionalProps.count = lastBlock.count + 1
        } else {
          additionalProps.count = 1
        }
      }

      if (isQuestion) {
        questionId = block.id

        additionalProps.questionInputType = getQuestionInputTypeAt(blocks, index)
      }

      additionalProps.questionId = questionId

      const normalizedBlock = new Block(block, additionalProps as BlockConstructorOptions)

      return [...previousBlocks, normalizedBlock]
    }, [])
  }
}
