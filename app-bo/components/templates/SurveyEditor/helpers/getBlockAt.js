import * as R from 'ramda'

const getBlockAt = (blocks, position) => R.find(R.propEq('position', position))(blocks)

export default getBlockAt
