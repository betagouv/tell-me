import { handleError } from '@common/helpers/handleError'

import { generateTellMeTreeChildren } from './generateTellMeTreeChildren'

import type { Block } from '../libs/SurveyEditorManager/Block'
import type { TellMe } from '@schemas/1.0.0/TellMe'

export function generateTellMeTree({
  backgroundUri,
  blocks,
  coverUri,
  id,
  language,
  logoUri,
  thankYouMessage,
  title,
}: Omit<TellMe.Tree, 'children' | 'data' | 'type'> &
  Omit<TellMe.Tree['data'], 'version'> & {
    blocks: Block[]
  }): TellMe.Tree | undefined {
  try {
    const children = generateTellMeTreeChildren(blocks)
    const data: TellMe.Tree['data'] = {
      backgroundUri,
      coverUri,
      language,
      logoUri,
      thankYouMessage,
      title,
      version: '1.0.0',
    }

    return {
      children,
      data,
      id,
      type: 'root',
    }
  } catch (err) {
    handleError(err, 'app/helpers/generateTellMeTree()')

    return undefined
  }
}
