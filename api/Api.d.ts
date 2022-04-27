declare namespace Api {
  type ResponseBodyFailure = {
    code: number
    hasError: true
    message: string
  }
  type ResponseBodySuccess<T> = {
    data: T
    hasError: false
  }
  type ResponseBody<T = any> = ResponseBodyFailure | ResponseBodySuccess<T>

  declare namespace Model {
    declare namespace Survey {
      import type { Types } from 'mongoose'

      type BlockType =
        | 'ACTION.NEXT'
        | 'ACTION.SUBMIT'
        | 'CONTENT.QUESTION'
        | 'CONTENT.SUBTITLE'
        | 'CONTENT.TEXT'
        | 'INPUT.CHECKBOX'
        | 'INPUT.CHOICE'
        | 'INPUT.EMAIL'
        | 'INPUT.FILE'
        | 'INPUT.LINEAR_SCALE'
        | 'INPUT.LINK'
        | 'INPUT.LONG_ANSWER'
        | 'INPUT.NUMBER'
        | 'INPUT.RATING'
        | 'INPUT.SHORT_ANSWER'

      interface Block {
        _id: Types.ObjectId
        position: BlockPosition
        props: BlockProps
        type: BlockType
        value: string
      }

      interface BlockPosition {
        page: number
        rank: number
      }

      interface BlockProps {
        ifSelectedThenShowQuestionId: Types.ObjectId | null
        isHidden: boolean
        isMandatory: boolean
      }

      interface BlockLegacy extends Block {
        _id: string
        props: BlockPropsLegacy
        type: string
      }

      interface BlockPropsLegacy extends BlockProps {
        ifSelectedThenShowQuestionId: string | null
      }
    }
  }
}
