import * as R from 'ramda'

const cleanBlockPositionIds = R.map(R.dissocPath(['position', '_id']))

export default cleanBlockPositionIds
