export default function insertBlock(blocks, newBlock) {
  const { position: newBlockPosition } = newBlock

  return blocks.reduce((newBlocks, block) => {
    const { position } = block
    if (position.page !== newBlockPosition.page || position.rank < newBlockPosition.rank) {
      return [...newBlocks, block]
    }

    const updatedBlocks = position.rank === newBlockPosition.rank ? [...newBlocks, newBlock] : newBlocks
    const updatedBlock = {
      ...block,
      position: {
        ...position,
        rank: position.rank + 1,
      },
    }

    return [...updatedBlocks, updatedBlock]
  }, [])
}
