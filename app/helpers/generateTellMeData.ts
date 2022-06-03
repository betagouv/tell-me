import { handleError } from '@common/helpers/handleError'

import generateTellMeDataAnswers from './generateTellMeDataAnswers'

import type TellMe from '../../schemas/1.0.0/TellMe'
import type SurveyEditorManager from '../libs/SurveyEditorManager'

export default function generateTellMeData({
  entries,
  formData,
  id,
  language,
  openedAt,
  submittedAt,
  surveyManager,
  title,
}: Omit<TellMe.Data, 'version'> &
  Omit<TellMe.DataEntry, 'answers'> & {
    formData: Record<string, string | string[]>
    surveyManager: SurveyEditorManager
  }): TellMe.Data | undefined {
  try {
    const answers: TellMe.DataEntryAnswer[] = generateTellMeDataAnswers(surveyManager, formData)

    const newEntries: TellMe.DataEntry[] = [
      ...entries,
      {
        answers,
        openedAt,
        submittedAt,
      },
    ]

    return {
      entries: newEntries,
      id,
      language,
      title,
      version: '1.0.0',
    }
  } catch (err) {
    handleError(err, 'app/helpers/generateTellMeData()')

    return undefined
  }
}
