import { isInputBlock, isQuestionBlock } from '../libs/SurveyEditorManager/helpers'
import handleError from './handleError'

import type TellMe from '../../schemas/1.0.0/TellMe'
import type SurveyEditorManagerBlock from '../libs/SurveyEditorManager/Block'

export default function generateTellMeTreeChildren(blocks: SurveyEditorManagerBlock[]): TellMe.TreeBlock[] {
  try {
    return blocks.map(block => {
      switch (true) {
        case isQuestionBlock(block):
          return {
            data: {
              ...block.data,
              isHidden: block.isHidden,
              isRequired: block.isRequired,
            },
            id: block.id,
            type: block.type,
            value: block.value,
          } as TellMe.QuestionBlock

        case isInputBlock(block):
          return {
            data: {
              ...block.data,
              ifTruethyThenShowQuestionIds: block.ifTruethyThenShowQuestionIds,
            },
            id: block.id,
            type: block.type,
            value: block.value,
          } as TellMe.InputBlock

        default:
          return {
            data: block.data,
            id: block.id,
            type: block.type,
            value: block.value,
          } as TellMe.ActionBlock | TellMe.ContentBlock
      }
    })
  } catch (err) {
    handleError(err, 'app/helpers/generateTellMeTreeChildren()')

    return []
  }
}
