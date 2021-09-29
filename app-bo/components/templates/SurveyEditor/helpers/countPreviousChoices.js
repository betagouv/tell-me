import getBlockAt from './getBlockAt'
import getPreviousBlockPositionAt from './getPreviousBlockPositionAt'

const isPreviousInputChoice = (page, block, type) => block.position.page === page && block.type === type

export default function countPreviousChoicesAt(blocks, position) {
  const { page } = position
  const { type } = getBlockAt(blocks, position)
  let counter = 0
  let positionCursor = getPreviousBlockPositionAt(position)
  let previousBlock = getBlockAt(blocks, positionCursor)

  while (isPreviousInputChoice(page, previousBlock, type)) {
    counter += 1

    positionCursor = getPreviousBlockPositionAt(positionCursor)
    previousBlock = getBlockAt(blocks, positionCursor)
  }

  return counter
}
