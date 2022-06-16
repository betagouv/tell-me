import { SurveyEditorTitle } from '../atoms/SurveyEditorTitle'
import { Editable } from '../molecules/Editable'

type TitleEditorProps = {
  defaultValue: string
  isFocused: boolean
  onDownKeyDown: Common.FunctionLike
  onEnterKeyDown: Common.FunctionLike
  onFocus: Common.FunctionLike
  onValueChange: (newTitle: string) => void | Promise<void>
}
export function TitleEditor(props: TitleEditorProps) {
  return <Editable as={SurveyEditorTitle} isRichText={false} {...props} />
}
