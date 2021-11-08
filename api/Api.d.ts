declare namespace Api {
  import { Mongoose } from 'mongoose'
  import { NextApiResponse } from 'next'

  type ResponseWithMongoose<T = any> = NextApiResponse<T> & {
    db: Mongoose
  }

  type ResponseWithAuthentication<T = any> = ResponseWithMongoose<T> & {
    me: {
      id: string
    }
  }

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
      type Block = {
        _id: string
        position: BlockPosition
        props: BlockProps
        type: string
        value: string
      }

      type BlockPosition = {
        page: number
        rank: number
      }

      type BlockProps = {
        ifSelectedThenShowQuestionId: string | null
        isHidden: boolean
        isMandatory: boolean
      }
    }
  }
}
