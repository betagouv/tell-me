import { handleError } from '@common/helpers/handleError'

import { generateTellMeTreeChildren } from './generateTellMeTreeChildren'

import type { Block as SurveyEditorManagerBlock } from '../libs/SurveyEditorManager/Block'
import type { TellMe } from '@schemas/1.0.0/TellMe'

export function generateTellMeTree({
  backgroundUri,
  blocks,
  coverUri,
  id,
  language,
  logoUri,
  title,
}: Omit<TellMe.Tree, 'children' | 'data' | 'type'> &
  Omit<TellMe.Tree['data'], 'version'> & {
    blocks: SurveyEditorManagerBlock[]
  }): TellMe.Tree | undefined {
  try {
    const children = generateTellMeTreeChildren(blocks)
    const data: TellMe.Tree['data'] = {
      backgroundUri,
      coverUri,
      language,
      logoUri,
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
