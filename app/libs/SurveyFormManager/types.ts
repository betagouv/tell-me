import { TellMe } from '@schemas/1.0.0/TellMe'

export interface FieldInterface {
  get answer(): TellMe.Answer | undefined
  set inputBlock(newInputBlock: TellMe.InputBlock)
  get inputBlocks(): TellMe.InputBlock[]
  get inputType(): TellMe.InputBlock['type'] | undefined
  get isVisible(): boolean
  set isVisible(newValue: boolean)
  get type(): TellMe.Answer['type'] | undefined
}

export type FieldVisibilityCondition = {
  condition: (rawValue: TellMe.Answer['rawValue'] | undefined) => boolean
  field: FieldInterface
}
