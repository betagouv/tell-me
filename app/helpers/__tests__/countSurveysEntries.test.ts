/**
 * @jest-environment jsdom
 */

import cuid from 'cuid'

import { countSurveysEntries } from '../countSurveysEntries'

import type { SurveyWithJsonType } from '@common/types'
import type { PartialDeep } from 'type-fest'

describe('app/helpers/countSurveysEntries()', () => {
  test('with a valid tree', async () => {
    const surveys: Array<PartialDeep<SurveyWithJsonType>> = [
      {
        data: {
          entries: [
            {
              id: cuid(),
            },
          ],
        },
      },
      {
        data: {
          entries: [
            {
              id: cuid(),
            },
            {
              id: cuid(),
            },
          ],
        },
      },
    ]

    const result = countSurveysEntries(surveys as any)

    expect(result).toStrictEqual(3)
  })
})
