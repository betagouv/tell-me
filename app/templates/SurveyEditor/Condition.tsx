import { Select } from '@singularity/core'
import BetterPropTypes from 'better-prop-types'
import { FunctionComponent } from 'react'
import { CornerDownRight } from 'react-feather'
import styled from 'styled-components'

import Block from '../../libs/SurveyManager/Block'
import { SelectOptionShape } from '../../shapes'

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
  onChange: any
  questionBlockAsOptions: any
}
const Condition: FunctionComponent<ConditionProps> = ({ block, onChange, questionBlockAsOptions }) => (
  <Box>
    <CornerDownRight />
    <StyledSelect
      defaultValue={block.questionBlockAsOption}
      onChange={onChange}
      options={questionBlockAsOptions}
      size="small"
    />
  </Box>
)

Condition.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  block: BetterPropTypes.any.isRequired,
  onChange: BetterPropTypes.func.isRequired,
  questionBlockAsOptions: BetterPropTypes.arrayOf(BetterPropTypes.shape(SelectOptionShape)).isRequired,
}

export default Condition
