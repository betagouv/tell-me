import { styled } from '@singularity-ui/core'
import { Link } from 'react-router-dom'

import { USER_ROLE } from '../../common/constants'
import useAuth from '../hooks/useAuth'

const Container = styled.div`
  background-color: #293042;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 16rem;
`

const Brand = styled.div`
  align-items: center;
  color: white;
  display: flex;
  height: 4rem;
  font-size: 1.25rem;
  justify-content: center;
  position: relative;
  text-transform: uppercase;

  &:before {
    background-color: rgba(255, 255, 255, 0.3);
    bottom: 0;
    content: ' ';
    height: 1px;
    left: 1rem;
    position: absolute;
    width: calc(100% - 2rem);
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;

  > a {
    color: white;
    display: block;
    opacity: 0.75;
    padding: 0.5rem 1rem;
    text-decoration: none;

    :hover {
      opacity: 1;
    }
  }
`

export default function Menu() {
  const { user } = useAuth()

  return (
    <Container>
      <div>
        <Brand>Tell Me</Brand>

        <List>
          <Link to="/">Dashboard</Link>
          <Link to="/surveys">Surveys</Link>

          {user.role === USER_ROLE.ADMINISTRATOR && <Link to="/users">Users</Link>}
        </List>
      </div>
    </Container>
  )
}
