import styled from 'styled-components'

const Container = styled.div`
  height: 5rem;
  position: relative;
`

const Placeholder = styled.div`
  background-color: #d5e5a3;
  border: solid 2px #d5e5a3;
  border-radius: 50%;
  cursor: pointer;
  height: 6rem;
  left: 2.5rem;
  position: absolute;
  top: -3rem;
  width: 6rem;

  :hover {
    background-color: white;
  }
`

export default function Logo() {
  return (
    <Container>
      <Placeholder />
    </Container>
  )
}
