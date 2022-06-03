/* eslint-disable @typescript-eslint/no-use-before-define */

import type TellMe from '../../../schemas/1.0.0/TellMe'

interface GetCountLetter {
  (count: number): string
}
export const getCountLetter: GetCountLetter = count => (count + 9).toString(36).toUpperCase()

export const getQuestionInputTypeAt = (
  blocks: Array<{
    type: TellMe.BlockType
  }>,
  index: number,
): TellMe.BlockType | undefined => {
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

export const isBlockCountable = (block: { type: TellMe.BlockType }) =>
  ['input_choice', 'input_multiple_choice'].includes(block.type)

export const isInputBlock = (block: { type: TellMe.BlockType }) => block.type.startsWith('input_')

export const isQuestionBlock = (block: { type: TellMe.BlockType }) => block.type === 'question'
