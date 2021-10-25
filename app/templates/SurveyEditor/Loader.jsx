import { styled } from '@singularity-ui/core'

import Title from '../../atoms/Title'

const Header = styled.div`
  background-color: #cccccc;
  height: 10rem;
`

const LogoContainer = styled.div`
  height: 5rem;
  position: relative;
`

const Logo = styled.div`
  background-color: #dddddd;
  border: solid 2px #dddddd;
  border-radius: 50%;
  height: 6rem;
  left: 2.5rem;
  position: absolute;
  top: -3rem;
  width: 6rem;
`

const TitleRow = styled.div`
  padding: 0 5rem;
`

const Text = styled.div`
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