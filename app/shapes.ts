/* eslint-disable import/prefer-default-export */

import BetterPropTypes from 'better-prop-types'

export const SelectOptionShape = {
  label: BetterPropTypes.string.isRequired,
  value: BetterPropTypes.string.isRequired,
}
