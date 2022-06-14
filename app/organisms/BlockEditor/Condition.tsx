import { Select } from '@singularity/core'
import { useCallback } from 'react'
import { CornerDownRight } from 'react-feather'
import styled from 'styled-components'

import type { Block } from '../../libs/SurveyEditorManager/Block'

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
  block: Block
  onChange: (newQuestionBlocksIds: string[]) => void | Promise<void>
  questionBlocksAsOptions: Common.App.SelectOption[]
}
export function Condition({ block, onChange, questionBlocksAsOptions }: ConditionProps) {
  const handleChange = useCallback((newQuestionBlocksAsOptions: Common.App.SelectOption[]) => {
    const newQuestionBlocksIds = newQuestionBlocksAsOptions.map(({ value }) => value)

    onChange(newQuestionBlocksIds)
  }, [])

  return (
    <Box>
      <CornerDownRight />
      <StyledSelect
        defaultValue={block.ifTruethyThenShowQuestionsAsOptions}
        isMulti
        onChange={handleChange as any}
        options={questionBlocksAsOptions}
        size="small"
      />
    </Box>
  )
}
