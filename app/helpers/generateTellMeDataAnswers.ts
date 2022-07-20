/* eslint-disable no-case-declarations */

import { handleError } from '@common/helpers/handleError'
import * as R from 'ramda'

import type { SurveyEditorManager } from '../libs/SurveyEditorManager'
import type { TellMe } from '@schemas/1.0.0/TellMe'

export function generateTellMeDataAnswers(
  surveyManager: SurveyEditorManager,
  formData: Record<string, string | string[]>,
): TellMe.DataEntryAnswer[] {
  try {
    return R.pipe(
      R.toPairs,
      R.map(([questionBlockId, answerOrAnswers]: [string, string | string[]]) => {
        const questionBlockIndex = surveyManager.findBlockIndexById(questionBlockId)
        const questionBlock = surveyManager.blocks[questionBlockIndex]
        const questionInputType = surveyManager.getQuestionInputTypeAt(questionBlockIndex)
        if (questionInputType === undefined) {
          throw new Error(`This question should have an input type.`)
        }

        switch (questionInputType) {
          case 'input_choice':
          case 'input_long_answer':
          case 'input_short_answer':
            const stringAnswer: TellMe.StringAnswer = {
              data: {
                isMarkdown: false,
                value: answerOrAnswers as string,
              },
              question: {
                id: questionBlock.id,
                key: questionBlock.key,
                value: questionBlock.value,
              },
              rawValue: answerOrAnswers as string,
              type: 'string',
            }

            return stringAnswer

          case 'input_multiple_choice':
            const stringsAnswer: TellMe.StringsAnswer = {
              data: {
                values: answerOrAnswers as string[],
              },
              question: {
                id: questionBlock.id,
                key: questionBlock.key,
                value: questionBlock.value,
              },
              rawValue: (answerOrAnswers as string[]).join(', '),
              type: 'strings',
            }

            return stringsAnswer

          default:
            throw new Error(`This question should have an input type.`)
        }
      }),
    )(formData)
  } catch (err) {
    handleError(err, 'app/helpers/generateTellMeDataAnswers()')

    return []
  }
}
