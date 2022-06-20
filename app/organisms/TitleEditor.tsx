import { SurveyEditorTitle } from '../atoms/SurveyEditorTitle'
import { Editable } from '../molecules/Editable'

import type { Promisable } from 'type-fest'

type TitleEditorProps = {
  defaultValue: string
  isFocused: boolean
  onDownKeyDown: () => Promisable<void>
  onEnterKeyDown: () => Promisable<void>
  onFocus: () => Promisable<void>
  onValueChange: (newTitle: string) => void | Promise<void>
}
export function TitleEditor(props: TitleEditorProps) {
  return <Editable as={SurveyEditorTitle} isRichText={false} {...props} />
}
