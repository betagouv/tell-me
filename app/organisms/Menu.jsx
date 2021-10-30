import { styled } from '@singularity-ui/core'
import { LogOut, Settings } from 'react-feather'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { USER_ROLE } from '../../common/constants'
import useAuth from '../hooks/useAuth'

const Container = styled.div`
  background-color: #293042;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  min-width: 16rem;
  position: fixed;
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

const MainMenu = styled.div`
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

const UserMenu = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.625rem 1rem;

  > a,
  > svg {
    color: white;
    display: block;
    opacity: 0.75;
    cursor: pointer;
    text-decoration: none;

    :hover {
      opacity: 1;
    }
  }
`

export default function Menu() {
  const intl = useIntl()
  const { logOut, user } = useAuth()

  return (
    <Container>
      <div>
        <Brand>Tell Me</Brand>

        <MainMenu>
          <Link to="/">
            {intl.formatMessage({
              defaultMessage: 'Dashboard',
              description: '[Sidebar Main Menu] Dashboard label.',
              id: 'EEsDeJ',
            })}
          </Link>
          <Link to="/surveys">
            {intl.formatMessage({
              defaultMessage: 'Surveys',
              description: '[Sidebar Main Menu] Surveys label.',
              id: 'D6/Uxz',
            })}
          </Link>

          {user.role === USER_ROLE.ADMINISTRATOR && (
            <>
              <Link to="/users">
                {intl.formatMessage({
                  defaultMessage: 'Users',
                  description: '[Sidebar Main Menu] Users label.',
                  id: 'zGNJ13',
                })}
              </Link>
              <Link to="/one-time-tokens">
                {intl.formatMessage({
                  defaultMessage: 'One Time Tokens',
                  description: '[Sidebar Main Menu] One Time Tokens label.',
                  id: 'tIFSst',
                })}
              </Link>
            </>
          )}
        </MainMenu>
      </div>
      <UserMenu>
        <Link to="/me">
          <Settings />
        </Link>
        <LogOut onClick={logOut} />
      </UserMenu>
    </Container>
  )
}
