import PropTypes from 'prop-types'

import { SURVEY_BLOCK_TYPES } from '../../../../common/constants'

export const BlockPosition = PropTypes.shape({
  page: PropTypes.number.isRequired,
  rank: PropTypes.number.isRequired,
})

export const BlockType = PropTypes.oneOf(SURVEY_BLOCK_TYPES)

export const Block = PropTypes.shape({
  position: BlockPosition.isRequired,
  type: BlockType.isRequired,
  value: PropTypes.string.isRequired,
})
