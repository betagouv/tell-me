import cuid from 'cuid'
import * as R from 'ramda'

import { generateTellMeTreeChildren } from '../../helpers/generateTellMeTreeChildren'
import { Block } from './Block'
import { INITIAL_BLOCKS } from './constants'
import { getQuestionInputTypeAt, isBlockCountable, isInputBlock, isQuestionBlock } from './helpers'

import type { BlockConstructorOptions } from './types'
import type { TellMe } from '@schemas/1.0.0/TellMe'

export class SurveyEditorManager {
  #blocks: Block[]
  #focusedBlockIndex: number

  public get blocks() {
    return this.#blocks
  }

  public get focusedBlock(): Block | null {
    if (this.#focusedBlockIndex < 0) {
      return null
    }

    const block = this.#blocks[this.#focusedBlockIndex]
    if (block === undefined) {
      return null
    }

    return block
  }

  public get focusedBlockIndex(): number {
    return this.#focusedBlockIndex
  }

  public get isFocused(): boolean {
    return this.#focusedBlockIndex !== -1
  }

  public get questionBlocksAsOptions(): Common.App.SelectOption[] {
    return R.pipe<any, any, any>(
      R.filter(isQuestionBlock),
      R.map(({ id, value }) => ({ label: value, value: id })),
    )(this.#blocks) as Common.App.SelectOption[]
  }

  constructor(initialBlocks: TellMe.TreeBlock[] = INITIAL_BLOCKS) {
    this.#blocks = []
    this.#focusedBlockIndex = -1

    this.appendNewBlockAt = this.appendNewBlockAt.bind(this)
    this.appendNewBlockToFocusedBlock = this.appendNewBlockToFocusedBlock.bind(this)
    this.findBlockIndexById = this.findBlockIndexById.bind(this)
    this.focusNextBlock = this.focusNextBlock.bind(this)
    this.focusPreviousBlock = this.focusPreviousBlock.bind(this)
    this.getQuestionInputTypeAt = this.getQuestionInputTypeAt.bind(this)
    this.initializeBlocks = this.initializeBlocks.bind(this)
    this.removeBlockAt = this.removeBlockAt.bind(this)
    this.removeFocusedBlock = this.removeFocusedBlock.bind(this)
    this.setBlockPropsAt = this.setBlockPropsAt.bind(this)
    this.setBlockTypeAt = this.appendNewBlockAt.bind(this)
    this.setBlockValueAt = this.appendNewBlockAt.bind(this)
    this.setFocusAt = this.setFocusAt.bind(this)
    this.setFocusedBlockProps = this.setFocusedBlockProps.bind(this)
    this.setFocusedBlockType = this.setFocusedBlockType.bind(this)
    this.setFocusedBlockValue = this.setFocusedBlockValue.bind(this)
    this.setIfSelectedThenShowQuestionIdsAt = this.setIfSelectedThenShowQuestionIdsAt.bind(this)
    this.toggleBlockObligationAt = this.toggleBlockObligationAt.bind(this)
    this.toggleBlockVisibilityAt = this.toggleBlockVisibilityAt.bind(this)
    this.unsetFocus = this.unsetFocus.bind(this)

    this.initializeBlocks(initialBlocks)
  }

  /**
   * @description
   * If `index=-1`, the new block is prepended to the first block.
   */
  public appendNewBlockAt(index: number, type: TellMe.BlockType): void {
    if (index !== -1 && this.#blocks[index] === undefined) {
      return
    }

    const oldBlock = this.blocks[index]

    const newBlock = {
      data: {
        pageIndex: index === -1 || oldBlock === undefined ? 0 : oldBlock.data.pageIndex,
        pageRankIndex: index === -1 || oldBlock === undefined ? 0 : oldBlock.data.pageRankIndex + 1,
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

    const blocksAsTellMeTreeBlocks = generateTellMeTreeChildren(this.#blocks)

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
      if (nextBlock === undefined || isQuestionBlock(nextBlock)) {
        break
      }

      if (isInputBlock(nextBlock)) {
        return nextBlock.type
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

    this.#blocks = this.#blocks.reduce((newBlocks: Block[], block: Block) => {
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

  public setBlockTypeAt(index: number, newType: TellMe.BlockType): void {
    const treeBlocks = generateTellMeTreeChildren(this.#blocks)

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

  public setBlockPropsAt(index: number, newProps: Partial<Block>): void {
    const updatedBlock = Object.assign(this.blocks[index], newProps)

    this.#blocks = R.update(index, updatedBlock)(this.#blocks)
  }

  public setBlockValueAt(index: number, newValue: string): void {
    const updatedBlock = Object.assign(this.blocks[index], {
      value: newValue,
    })

    this.#blocks = R.update(index, updatedBlock)(this.#blocks)
  }

  public setFocusAt(index = -1): void {
    this.#focusedBlockIndex = index
  }

  public setFocusedBlockType(newType: TellMe.BlockType): void {
    if (!this.isFocused) {
      return
    }

    this.setBlockTypeAt(this.focusedBlockIndex, newType)
  }

  public setFocusedBlockValue(newValue): void {
    if (!this.isFocused) {
      return
    }

    this.setBlockValueAt(this.focusedBlockIndex, newValue)
  }

  public setFocusedBlockProps(newProps: Partial<Block>): void {
    if (!this.isFocused) {
      return
    }

    this.setBlockPropsAt(this.focusedBlockIndex, newProps)
  }

  public setIfSelectedThenShowQuestionIdsAt(index: number, questionBlockIds: string[]): void {
    const questionBlocksAsOptions = questionBlockIds
      .map(questionBlockId => this.findBlockIndexById(questionBlockId))
      .map(questionBlockIndex => this.#blocks[questionBlockIndex])
      .map(questionBlock => ({
        label: questionBlock.value,
        value: questionBlock.id,
      }))

    const updatedBlock = Object.assign(this.blocks[index], {
      ifTruethyThenShowQuestionIds: questionBlockIds,
      ifTruethyThenShowQuestionsAsOptions: questionBlocksAsOptions,
    })

    this.#blocks = R.update(index, updatedBlock)(this.#blocks)
  }

  public toggleBlockObligationAt(index: number): void {
    this.setBlockPropsAt(index, {
      isRequired: !this.blocks[index].isRequired,
    })
  }

  public toggleBlockVisibilityAt(index: number): void {
    this.setBlockPropsAt(index, {
      isHidden: !this.blocks[index].isHidden,
    })
  }

  public unsetFocus(): void {
    this.setFocusAt()
  }

  private initializeBlocks(blocks: TellMe.TreeBlock[]) {
    let questionId: string | null = null
    let isHidden: boolean = false

    this.#blocks = blocks.reduce((previousBlocks: Block[], block: TellMe.TreeBlock, index: number) => {
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
        isHidden = (block as TellMe.QuestionBlock).data.isHidden
        questionId = block.id

        additionalProps.questionInputType = getQuestionInputTypeAt(blocks, index)
      }

      additionalProps.isHidden = isHidden
      additionalProps.questionId = questionId

      const normalizedBlock = new Block(block, additionalProps as BlockConstructorOptions)

      return [...previousBlocks, normalizedBlock]
    }, [])
  }
}
