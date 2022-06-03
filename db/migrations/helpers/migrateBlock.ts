import { SURVEY_BLOCK_TYPE } from '../../../common/constants'

import type TellMe from '../../../schemas/1.0.0/TellMe'

export default function migrateBlock(block: Api.Model.Survey.Block): TellMe.TreeBlock {
  const newBlock = {
    data: {
      pageIndex: block.position.page - 1,
      pageRankIndex: block.position.rank - 1,
    },
    id: block._id.toString(),
    value: block.value,
  }

  switch (block.type) {
    case SURVEY_BLOCK_TYPE.ACTION.NEXT:
      return {
        ...newBlock,
        type: 'action_next',
      }

    case SURVEY_BLOCK_TYPE.ACTION.SUBMIT:
      return {
        ...newBlock,
        type: 'action_submit',
      }

    case SURVEY_BLOCK_TYPE.CONTENT.QUESTION:
      return {
        ...newBlock,
        data: {
          ...newBlock.data,
          isHidden: block.props.isHidden,
          isRequired: block.props.isMandatory,
        },
        type: 'question',
      }

    case SURVEY_BLOCK_TYPE.CONTENT.SUBTITLE:
      return {
        ...newBlock,
        type: 'content_subtitle',
      }

    case SURVEY_BLOCK_TYPE.CONTENT.TEXT:
      return {
        ...newBlock,
        type: 'content_text',
      }

    case SURVEY_BLOCK_TYPE.INPUT.CHECKBOX:
      return {
        ...newBlock,
        data: {
          ...newBlock.data,
          ifTruethyThenShowQuestionIds:
            block.props.ifSelectedThenShowQuestionId !== null
              ? [block.props.ifSelectedThenShowQuestionId.toString()]
              : [],
        },
        type: 'input_multiple_choice',
      }

    case SURVEY_BLOCK_TYPE.INPUT.CHOICE:
      return {
        ...newBlock,
        data: {
          ...newBlock.data,
          ifTruethyThenShowQuestionIds:
            block.props.ifSelectedThenShowQuestionId !== null
              ? [block.props.ifSelectedThenShowQuestionId.toString()]
              : [],
        },
        type: 'input_choice',
      }

    case SURVEY_BLOCK_TYPE.INPUT.EMAIL:
      return {
        ...newBlock,
        data: {
          ...newBlock.data,
          ifTruethyThenShowQuestionIds:
            block.props.ifSelectedThenShowQuestionId !== null
              ? [block.props.ifSelectedThenShowQuestionId.toString()]
              : [],
        },
        type: 'input_email',
      }

    case SURVEY_BLOCK_TYPE.INPUT.FILE:
      return {
        ...newBlock,
        data: {
          ...newBlock.data,
          ifTruethyThenShowQuestionIds:
            block.props.ifSelectedThenShowQuestionId !== null
              ? [block.props.ifSelectedThenShowQuestionId.toString()]
              : [],
        },
        type: 'input_file',
      }

    case SURVEY_BLOCK_TYPE.INPUT.LINEAR_SCALE:
      return {
        ...newBlock,
        data: {
          ...newBlock.data,
          ifTruethyThenShowQuestionIds:
            block.props.ifSelectedThenShowQuestionId !== null
              ? [block.props.ifSelectedThenShowQuestionId.toString()]
              : [],
        },
        type: 'input_linear_scale',
      }

    case SURVEY_BLOCK_TYPE.INPUT.LINK:
      return {
        ...newBlock,
        data: {
          ...newBlock.data,
          ifTruethyThenShowQuestionIds:
            block.props.ifSelectedThenShowQuestionId !== null
              ? [block.props.ifSelectedThenShowQuestionId.toString()]
              : [],
        },
        type: 'input_link',
      }

    case SURVEY_BLOCK_TYPE.INPUT.LONG_ANSWER:
      return {
        ...newBlock,
        data: {
          ...newBlock.data,
          ifTruethyThenShowQuestionIds:
            block.props.ifSelectedThenShowQuestionId !== null
              ? [block.props.ifSelectedThenShowQuestionId.toString()]
              : [],
        },
        type: 'input_long_answer',
      }

    case SURVEY_BLOCK_TYPE.INPUT.NUMBER:
      return {
        ...newBlock,
        data: {
          ...newBlock.data,
          ifTruethyThenShowQuestionIds:
            block.props.ifSelectedThenShowQuestionId !== null
              ? [block.props.ifSelectedThenShowQuestionId.toString()]
              : [],
        },
        type: 'input_number',
      }

    case SURVEY_BLOCK_TYPE.INPUT.RATING:
      return {
        ...newBlock,
        data: {
          ...newBlock.data,
          ifTruethyThenShowQuestionIds:
            block.props.ifSelectedThenShowQuestionId !== null
              ? [block.props.ifSelectedThenShowQuestionId.toString()]
              : [],
        },
        type: 'input_rating',
      }

    case SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER:
      return {
        ...newBlock,
        data: {
          ...newBlock.data,
          ifTruethyThenShowQuestionIds:
            block.props.ifSelectedThenShowQuestionId !== null
              ? [block.props.ifSelectedThenShowQuestionId.toString()]
              : [],
        },
        type: 'input_short_answer',
      }

    default:
      throw new Error(`[db/migrations/helpers/migrateBlock.ts] Unhandled block type: ${block.type}.`)
  }
}
