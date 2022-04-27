import { Select } from '@singularity-ui/core'
import { CornerDownRight } from 'react-feather'
import styled from 'styled-components'

import SurveyEditorManagerBlock from '../../libs/SurveyEditorManager/Block'

const Box = styled.div`
  display: flex;
  padding: 0.5rem 0;

  > svg {
    margin: 0.25rem 0.5rem 0 0.6rem;
  }
`

const StyledSelect = styled(Select)`
  width: 100%;
`

type ConditionProps = {
  block: SurveyEditorManagerBlock
  onChange: (newQuestionBlocksIds: string[]) => void | Promise<void>
  questionBlocksAsOptions: App.SelectOption[]
}
export default function Condition({ block, onChange, questionBlocksAsOptions }: ConditionProps) {
  const handleChange = (newQuestionBlocksAsOptions: App.SelectOption[]) => {
    const newQuestionBlocksIds = newQuestionBlocksAsOptions.map(({ value }) => value)

    onChange(newQuestionBlocksIds)
  }

  return (
    <Box>
      <CornerDownRight />
      <StyledSelect
        defaultValue={block.ifTruethyThenShowQuestionsAsOptions}
        isMulti
        onChange={handleChange}
        options={questionBlocksAsOptions}
        size="small"
      />
    </Box>
  )
}
