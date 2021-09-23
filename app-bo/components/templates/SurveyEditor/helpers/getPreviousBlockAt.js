import getBlockAt from './getBlockAt'
import getPreviousBlockPositionAt from './getPreviousBlockPositionAt'

const getPreviousBlockAt = (blocks, position) => getBlockAt(blocks, getPreviousBlockPositionAt(position))

export default getPreviousBlockAt
