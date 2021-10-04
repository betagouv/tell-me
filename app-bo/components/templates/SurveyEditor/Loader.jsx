import MuiBox from '@mui/material/Box'
import MuiSkeleton from '@mui/material/Skeleton'
import { styled } from '@mui/material/styles'

import Title from '../../../../app-fo/components/atoms/Title'

const Header = styled(MuiSkeleton)`
  background-color: #cccccc;
  height: 10rem;
`

const LogoContainer = styled(MuiBox)`
  height: 5rem;
  position: relative;
`

const Logo = styled(MuiSkeleton)`
  background-color: #dddddd;
  border: solid 2px #dddddd;
  height: 6rem;
  left: 2.5rem;
  position: absolute;
  top: -3rem;
  width: 6rem;
`

const TitleRow = styled(MuiBox)`
  padding: 0 5rem;
`

const Text = styled(MuiSkeleton)`
  background-color: #cccccc;
`

export default function Button() {
  return (
    <>
      <Header variant="rectangular" />

      <LogoContainer>
        <Logo animation="wave" variant="circular" />
      </LogoContainer>

      <TitleRow>
        <Title>
          <Text variant="text" />
        </Title>
      </TitleRow>
    </>
  )
}
