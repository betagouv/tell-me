import { Select } from '@singularity-ui/core'
import PropTypes from 'prop-types'
import { CornerDownRight } from 'react-feather'
import styled from 'styled-components'

import { SelectOptionShape, SurveyManagerBlockShape } from '../../shapes'

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

export default function Condition({ block, onChange, questionBlockAsOptions }) {
  return (
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
}

Condition.propTypes = {
  block: PropTypes.shape(SurveyManagerBlockShape).isRequired,
  onChange: PropTypes.func.isRequired,
  questionBlockAsOptions: PropTypes.arrayOf(PropTypes.shape(SelectOptionShape)).isRequired,
}
