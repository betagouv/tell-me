import cuid from 'cuid'

import type { TellMe } from '@schemas/1.0.0/TellMe'

export const INITIAL_BLOCKS: TellMe.TreeBlock[] = [
  {
    data: {
      pageIndex: 0,
      pageRankIndex: 0,
    },
    id: cuid(),
    type: 'content_text',
    value: 'This is some free text.',
  },
  {
    data: {
      isHidden: false,
      isRequired: true,
      key: null,
      pageIndex: 0,
      pageRankIndex: 1,
    },
    id: cuid(),
    type: 'question',
    value: `What's your first question?`,
  },
]
