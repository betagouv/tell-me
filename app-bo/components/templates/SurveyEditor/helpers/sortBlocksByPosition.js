import * as R from 'ramda'

const sortBlocksByPosition = R.sortWith([
  R.ascend(R.path(['position', 'page'])),
  R.ascend(R.path(['position', 'rank'])),
])

export default sortBlocksByPosition
