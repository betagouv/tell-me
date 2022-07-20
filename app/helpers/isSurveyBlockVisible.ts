import type { Block } from '../libs/SurveyEditorManager/Block'

export function isSurveyBlockVisible(block: Block, blocks: Block[], values: Record<string, string | string[]>) {
  if (block.questionId === null || !block.isHidden) {
    return true
  }

  const neededBlocks = blocks.filter(
    _block =>
      _block.isInput &&
      _block.questionId !== null &&
      _block.ifTruethyThenShowQuestionIds.includes(block.questionId as string),
  )

  const found = neededBlocks.find(_block => {
    // This case should be impossible
    // TODO Improve typings instead of ignoring an impossible case.
    /* istanbul ignore next */
    if (_block.questionId === null) {
      return false
    }

    const valueOrValues: string | string[] | undefined = values[_block.questionId]
    if (valueOrValues === undefined) {
      return false
    }

    switch (_block.type) {
      case 'input_choice':
        return typeof valueOrValues === 'string' && valueOrValues === _block.value

      case 'input_multiple_choice':
        return Array.isArray(valueOrValues) && valueOrValues.includes(_block.value)

      default:
        return typeof valueOrValues === 'string' && valueOrValues.trim().length > 0
    }
  })

  return found !== undefined
}
