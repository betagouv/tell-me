import { Card } from '@singularity/core'
import numeral from 'numeral'
import { BeatLoader } from 'react-spinners'
import styled from 'styled-components'

const Box = styled.div`
  max-width: 20rem;
  padding-right: 1rem;
  width: 33.33%;
`

const StyledCard = styled(Card)`
  display: flex;
  justify-content: space-between;
`

const Label = styled.h6`
  font-size: 125%;
  font-weight: 500;
`

const Value = styled.p`
  font-size: 150%;
  font-weight: 500;
`

const IconBox = styled.div`
  font-size: 200%;
`

type AdminFigureProps = {
  icon: JSX.Element
  label: string
  value?: number
}
export function AdminFigure({ icon, label, value }: AdminFigureProps) {
  return (
    <Box>
      <StyledCard>
        <div>
          <Label>{label}</Label>
          <Value>{value !== undefined ? numeral(value).format('0,0') : <BeatLoader size={6} />}</Value>
        </div>

        <IconBox>{icon}</IconBox>
      </StyledCard>
    </Box>
  )
}
