import { renderSurveyBlocks } from '@app/helpers/renderSurveyBlocks'
import { useFormikContext } from 'formik'

import type { Block } from '../libs/SurveyEditorManager/Block'

type SurveyFormBodyProps = {
  blocks: Block[]
}
export function SurveyFormBody({ blocks }: SurveyFormBodyProps) {
  const formikContext = useFormikContext<Record<string, string>>()

  return <>{renderSurveyBlocks(formikContext, blocks)}</>
}
