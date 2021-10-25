import PropTypes from 'prop-types'

import { SURVEY_BLOCK_TYPES } from '../common/constants'

export const SelectOptionShape = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

export const SurveyManagerBlockPositionShape = {
  page: PropTypes.number.isRequired,
  rank: PropTypes.number.isRequired,
}

export const SurveyManagerBlockShape = {
  ifSelectedThenShowQuestionId: PropTypes.string,
  isCountable: PropTypes.bool.isRequired,
  isHidden: PropTypes.bool.isRequired,
  isInput: PropTypes.bool.isRequired,
  isMandatory: PropTypes.bool.isRequired,
  isQuestion: PropTypes.bool.isRequired,
  isUnlinked: PropTypes.bool.isRequired,
  position: PropTypes.shape(SurveyManagerBlockPositionShape),
  questionBlockAsOption: PropTypes.shape(SelectOptionShape),
  questionId: PropTypes.string,
  type: PropTypes.oneOf(SURVEY_BLOCK_TYPES).isRequired,
  value: PropTypes.string.isRequired,
}
