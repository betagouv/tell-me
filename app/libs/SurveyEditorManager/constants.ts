import cuid from 'cuid'

import type { TellMe } from '@schemas/1.0.0/TellMe'

const IS_DEMO = process.env.NEXT_PUBLIC_IS_DEMO === 'true'

export const INITIAL_BLOCKS: TellMe.TreeBlock[] = !IS_DEMO
  ? [
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
      {
        data: {
          ifTruethyThenShowQuestionIds: [],
          pageIndex: 0,
          pageRankIndex: 1,
        },
        id: cuid(),
        type: 'input_long_answer',
        value: `Your first answer.`,
      },
    ]
  : []
