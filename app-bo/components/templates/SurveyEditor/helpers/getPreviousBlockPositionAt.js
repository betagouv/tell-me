const getPreviousBlockPositionAt = position => ({
  page: position.page,
  rank: position.rank - 1,
})

export default getPreviousBlockPositionAt
