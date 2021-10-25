import { Button, styled } from '@singularity-ui/core'

import useAuth from '../../hooks/useAuth'

const Container = styled.header`
  align-items: center;
  border-bottom: 1px solid #dddddd;
  display: flex;
  height: 4rem;
  justify-content: space-between;
  padding: 0 1.5rem;
`

export default function Header() {
  const { logOut } = useAuth(true)

  return (
    <Container>
      <span>-</span>

      <Button onClick={logOut}>Log Out</Button>
    </Container>
  )
}
