import cuid from 'cuid'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'

import type TellMe from '../../../schemas/1.0.0/TellMe'
import type { Types } from 'mongoose'

export type MongoSurveyEntryAnswer = {
  _id: Types.ObjectId
  question: string
  type: Api.Model.Survey.BlockType
  values: string[]
}

export default function migrateAnswer(answer: MongoSurveyEntryAnswer): TellMe.DataEntryAnswer {
  switch (answer.type) {
    case SURVEY_BLOCK_TYPE.INPUT.CHECKBOX:
      return {
        data: {
          values: answer.values,
        },
        question: {
          id: cuid(),
          value: answer.question,
        },
        rawValue: answer.values.join(','),
        type: 'strings',
      }

    case SURVEY_BLOCK_TYPE.INPUT.CHOICE:
    case SURVEY_BLOCK_TYPE.INPUT.LONG_ANSWER:
    case SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER:
      return {
        data: {
          isMarkdown: false,
          value: answer.values[0],
        },
        question: {
          id: cuid(),
          value: answer.question,
        },
        rawValue: answer.values[0],
        type: 'string',
      }

    default:
      throw new Error(`[db/migrations/helpers/migrateAnswer.ts] Unhandled answer type: ${answer.type}.`)
  }
}
