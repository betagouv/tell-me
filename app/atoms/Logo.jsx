import { styled } from '@singularity-ui/core'

const Container = styled.div`
  height: 5rem;
  position: relative;
  width: 100%;
`

const Placeholder = styled.div`
  background-color: #d5e5a3;
  border: solid 2px #d5e5a3;
  border-radius: 50%;
  height: 6rem;
  left: -3rem;
  position: absolute;
  top: -3rem;
  width: 6rem;
`

export default function Logo() {
  return (
    <Container>
      <Placeholder />
    </Container>
  )
}