declare namespace Api {
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
