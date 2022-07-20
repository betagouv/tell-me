import { countSurveysEntries } from '@app/helpers/countSurveysEntries'
import ky from 'ky'

import type { SurveyWithJsonType } from '@common/types'

export type Statistics = {
  surveysCount: number | undefined
  surveysEntriesCount: number | undefined
}

export async function getStatistics(accessToken?: string): Promise<Statistics> {
  if (accessToken === undefined) {
    return {
      surveysCount: undefined,
      surveysEntriesCount: undefined,
    }
  }

  const response = await ky
    .get('api/surveys', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .json<Api.ResponseBodySuccess<SurveyWithJsonType[]>>()

  const { data: surveys } = response
  const surveysEntriesCount = countSurveysEntries(surveys)

  return {
    surveysCount: surveys.length,
    surveysEntriesCount,
  }
}
