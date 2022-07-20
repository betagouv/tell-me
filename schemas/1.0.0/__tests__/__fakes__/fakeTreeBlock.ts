/* eslint-disable no-case-declarations */

import cuid from 'cuid'

import { TellMe } from '../../TellMe'

type Args = TellMe.TreeBlock extends infer T
  ? T extends TellMe.TreeBlock
    ? [type: T['type'], customProps?: Partial<Omit<T, 'type'>>, customData?: Partial<T['data']>]
    : never
  : never

function fakeTreeBlock(
  type: TellMe.ActionBlock['type'],
  customProps?: Partial<Omit<TellMe.ActionBlock, 'data' | 'type'>>,
  customData?: Partial<TellMe.ActionBlock['data']>,
): TellMe.ActionBlock
function fakeTreeBlock(
  type: TellMe.ActionBlock['type'],
  customProps?: Partial<Omit<TellMe.ActionBlock, 'data' | 'type'>>,
  customData?: Partial<TellMe.ActionBlock['data']>,
): TellMe.ActionBlock
function fakeTreeBlock(
  type: TellMe.InputBlock['type'],
  customProps?: Partial<Omit<TellMe.InputBlock, 'data' | 'type'>>,
  customData?: Partial<TellMe.InputBlock['data']>,
): TellMe.InputBlock
function fakeTreeBlock(
  type: TellMe.QuestionBlock['type'],
  customProps?: Partial<Omit<TellMe.QuestionBlock, 'data' | 'type'>>,
  customData?: Partial<TellMe.QuestionBlock['data']>,
): TellMe.QuestionBlock
function fakeTreeBlock(...[type, customProps, customData]: Args): TellMe.TreeBlock {
  const treeBlock = {
    data: {
      pageIndex: customData?.pageIndex || 0,
      pageRankIndex: customData?.pageRankIndex || 0,
    },
    id: customProps?.id || cuid(),
    value: customProps?.value || '',
  }

  switch (type) {
    case 'input_checkbox':
    case 'input_choice':
    case 'input_email':
    case 'input_file':
    case 'input_linear_scale':
    case 'input_link':
    case 'input_long_answer':
    case 'input_multiple_choice':
    case 'input_number':
    case 'input_phone':
    case 'input_rating':
    case 'input_short_answer':
      const inputTreeBlock: TellMe.InputBlock = {
        ...treeBlock,
        data: {
          ...treeBlock.data,
          ifTruethyThenShowQuestionIds: customData?.ifTruethyThenShowQuestionIds || [],
        },
        type,
      }

      return inputTreeBlock

    case 'question':
      const questionTreeBlock: TellMe.QuestionBlock = {
        ...treeBlock,
        data: {
          ...treeBlock.data,
          isHidden: customData?.isHidden || false,
          isRequired: customData?.isRequired || false,
          key: customData?.key || null,
        },
        type,
      }

      return questionTreeBlock

    default:
      return {
        ...treeBlock,
        type,
      }
  }
}

export { fakeTreeBlock }
