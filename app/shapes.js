/* eslint-disable consistent-return, import/prefer-default-export */

import PropTypes from 'prop-types'

import { SURVEY_BLOCK_TYPES } from '../common/constants'

const mustBeStringOrNull = (props, propName, componentName) => {
  const propValue = props[propName]

  if (typeof propValue === 'string' || propValue === null) {
    return
  }

  if (propValue !== undefined) {
    return new Error(
      `Warning: Failed prop type: The prop \`${propName}\` is marked as required in \`${componentName}\`, but its value is \`undefined\`.`,
    )
  }

  return new Error(
    `Warning: Failed prop type: Invalid prop \`${propName}\` of value \`${propValue}\` supplied to \`${componentName}\`, expected \`string\` or \`null\`.`,
  )
}

export const SurveyManagerBlockShape = {
  ifSelectedThenShowQuestionId: PropTypes.objectOf(mustBeStringOrNull),
  isCountable: PropTypes.bool.isRequired,
  isHidden: PropTypes.bool.isRequired,
  isInput: PropTypes.bool.isRequired,
  isMandatory: PropTypes.bool.isRequired,
  isQuestion: PropTypes.bool.isRequired,
  isUnlinked: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(SURVEY_BLOCK_TYPES).isRequired,
  value: PropTypes.string.isRequired,
}
