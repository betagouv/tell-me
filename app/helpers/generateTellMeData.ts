import { handleError } from '@common/helpers/handleError'

import { generateTellMeDataAnswers } from './generateTellMeDataAnswers'

import type { SurveyEditorManager } from '../libs/SurveyEditorManager'
import type { TellMe } from '@schemas/1.0.0/TellMe'

export function generateTellMeData({
  entries,
  entryId,
  formData,
  language,
  openedAt,
  submittedAt,
  surveyId,
  surveyManager,
  title,
}: Omit<TellMe.Data, 'id' | 'version'> &
  Omit<TellMe.DataEntry, 'answers' | 'id'> & {
    entryId: string
    formData: Record<string, string | string[]>
    surveyId: string
    surveyManager: SurveyEditorManager
  }): TellMe.Data | undefined {
  try {
    const answers: TellMe.DataEntryAnswer[] = generateTellMeDataAnswers(surveyManager, formData)

    const newEntries: TellMe.DataEntry[] = [
      ...entries,
      {
        answers,
        id: entryId,
        openedAt,
        submittedAt,
      },
    ]

    return {
      entries: newEntries,
      id: surveyId,
      language,
      title,
      version: '1.0.0',
    }
  } catch (err) {
    handleError(err, 'app/helpers/generateTellMeData()')

    return undefined
  }
}
