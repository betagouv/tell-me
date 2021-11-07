declare namespace Api {
  declare namespace Model {
    declare namespace Block {
      type Position = {
        page: number
        rank: number
      }

      type Props = {
        ifSelectedThenShowQuestionId: string | null
        isHidden: boolean
        isMandatory: boolean
      }
    }
  }
}
