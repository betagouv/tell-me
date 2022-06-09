import { UserRole } from '@prisma/client'
import { VerticalMenu } from '@singularity/core'
import { useAuth } from 'nexauth/client'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { LogOut, Settings } from 'react-feather'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { Link } from '../atoms/Link'

const Container = styled.div`
  background-color: #293042;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  width: 16rem;
  position: fixed;
  overflow-y: auto;
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
  padding: ${p => p.theme.padding.layout.medium};

  span {
    padding: 0;
  }

  span > a {
    color: white;
    display: block;
    flex-grow: 1;
    padding: ${p => p.theme.padding.layout.small} ${p => p.theme.padding.layout.medium};
    text-decoration: none;
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
  const auth = useAuth<Common.Auth.User>()
  const intl = useIntl()
  const router = useRouter()

  const isAdmin = useMemo(() => auth.user?.role === UserRole.ADMINISTRATOR, [auth.user])

  return (
    <Container>
      <div>
        <Brand>Tell Me</Brand>

        <MainMenu>
          <VerticalMenu>
            <VerticalMenu.Item isActive={router.pathname === '/'} isDark>
              <Link href="/">
                {intl.formatMessage({
                  defaultMessage: 'Dashboard',
                  description: '[Sidebar Main Menu] Dashboard label.',
                  id: 'EEsDeJ',
                })}
              </Link>
            </VerticalMenu.Item>

            <VerticalMenu.Item isActive={router.pathname.startsWith('/surveys')} isDark>
              <Link href="/surveys">
                {intl.formatMessage({
                  defaultMessage: 'Surveys',
                  description: '[Sidebar Main Menu] Surveys label.',
                  id: 'D6/Uxz',
                })}
              </Link>
            </VerticalMenu.Item>

            {isAdmin && (
              <>
                <VerticalMenu.Item isActive={router.pathname.startsWith('/users')} isDark>
                  <Link href="/users">
                    {intl.formatMessage({
                      defaultMessage: 'Users',
                      description: '[Sidebar Main Menu] Users label.',
                      id: 'zGNJ13',
                    })}
                  </Link>
                </VerticalMenu.Item>

                <VerticalMenu.Item isActive={router.pathname.startsWith('/refresh-tokens')} isDark>
                  <Link href="/refresh-tokens">
                    {intl.formatMessage({
                      defaultMessage: 'Refresh Tokens',
                      description: '[Sidebar Main Menu] Refresh Tokens label.',
                      id: 'bkZg0U',
                    })}
                  </Link>
                </VerticalMenu.Item>

                <VerticalMenu.Item isActive={router.pathname.startsWith('/personal-access-tokens')} isDark>
                  <Link href="/personal-access-tokens">
                    {intl.formatMessage({
                      defaultMessage: 'Personal Access Tokens',
                      description: '[Sidebar Main Menu] Personal Access Tokens label.',
                      id: 'WL5w1n',
                    })}
                  </Link>
                </VerticalMenu.Item>

                <VerticalMenu.Item isActive={router.pathname.startsWith('/one-time-tokens')} isDark>
                  <Link href="/one-time-tokens">
                    {intl.formatMessage({
                      defaultMessage: 'One Time Tokens',
                      description: '[Sidebar Main Menu] One Time Tokens label.',
                      id: 'tIFSst',
                    })}
                  </Link>
                </VerticalMenu.Item>
              </>
            )}
          </VerticalMenu>
        </MainMenu>
      </div>

      <UserMenu>
        <Link href="/me">
          <Settings />
        </Link>
        <LogOut onClick={auth.logOut} />
      </UserMenu>
    </Container>
  )
}
