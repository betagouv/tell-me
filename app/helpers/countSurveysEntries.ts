import * as R from 'ramda'

import type { SurveyWithJsonType } from '@common/types'

export const countSurveysEntries: (surveys: SurveyWithJsonType[]) => number = R.pipe(
  R.map(R.path(['data', 'entries'])),
  R.flatten,
  R.length,
)
