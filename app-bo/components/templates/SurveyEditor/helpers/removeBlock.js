import * as R from 'ramda'

export default function removeBlock(blocks, oldBlock) {
  const { position: oldBlockPosition } = oldBlock

  return blocks.reduce((newBlocks, block) => {
    const { position } = block
    if (position.page !== oldBlockPosition.page || position.rank < oldBlockPosition.rank) {
      return [...newBlocks, block]
    }

    if (R.equals(position, oldBlockPosition)) {
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
  }, [])
}
