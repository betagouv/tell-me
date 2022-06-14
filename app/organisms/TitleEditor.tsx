import styled from 'styled-components'

import { SurveyTitle } from '../atoms/SurveyTitle'
import { Editable } from '../molecules/Editable'

export const TitleEditorComponent = styled(SurveyTitle)`
  :empty::before {
    content: 'Your Survey Title';
    cursor: text;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

type TitleEditorProps = {
  defaultValue: string
  isFocused: boolean
  onChange: (newTitle: string) => void | Promise<void>
  onDownKeyDown: Common.FunctionLike
  onEnterKeyDown: Common.FunctionLike
  onFocus: Common.FunctionLike
}
export function TitleEditor(props: TitleEditorProps) {
  return <Editable as={TitleEditorComponent} isRichText={false} {...props} />
}
