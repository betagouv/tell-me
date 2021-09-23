import { SURVEY_BLOCK_TYPE } from '../../../../../common/constants'
import getBlockAt from './getBlockAt'
import getPreviousBlockPositionAt from './getPreviousBlockPositionAt'

const isPreviousInputChoice = (page, block) =>
  block.position.page === page && block.type === SURVEY_BLOCK_TYPE.INPUT.CHOICE

export default function countPreviousChoicesAt(blocks, position) {
  const { page } = position
  let counter = 0
  let positionCursor = getPreviousBlockPositionAt(position)
  let previousBlock = getBlockAt(blocks, positionCursor)

  while (isPreviousInputChoice(page, previousBlock)) {
    counter += 1

    positionCursor = getPreviousBlockPositionAt(positionCursor)
    previousBlock = getBlockAt(blocks, positionCursor)
  }

  return counter
}
