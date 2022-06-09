import type { TellMe } from '@schemas/1.0.0/TellMe'

export type BlockConstructorOptions = {
  count?: number
  ifTruethyThenShowQuestionsAsOptions?: Common.App.SelectOption[]
  isCountable: boolean
  questionId: Common.Nullable<string>
  questionInputType?: TellMe.BlockType
}
