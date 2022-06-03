export type BlockConstructorOptions = {
  count?: number
  ifTruethyThenShowQuestionsAsOptions?: App.SelectOption[]
  isCountable: boolean
  questionId: Common.Nullable<string>
  questionInputType?: string
}
