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

  p:not(:first-child) {
    margin-top: ${p => p.theme.padding.layout.large};
  }

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

const MainMenuTitle = styled.p`
  border-top: 1px solid ${p => p.theme.color.body.white};
  color: ${p => p.theme.color.body.white};
  font-size: 80%;
  font-weight: 500;
  margin: ${p => p.theme.padding.layout.giant} 0 0;
  opacity: 0.35;
  padding: ${p => p.theme.padding.layout.small} ${p => p.theme.padding.layout.medium};
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

export function Menu() {
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
                  description: '[Main Menu] Dashboard item.',
                  id: 'EEsDeJ',
                })}
              </Link>
            </VerticalMenu.Item>

            <VerticalMenu.Item isActive={router.pathname.startsWith('/surveys')} isDark>
              <Link href="/surveys">
                {intl.formatMessage({
                  defaultMessage: 'Surveys',
                  description: '[Main Menu] Surveys item.',
                  id: 'D6/Uxz',
                })}
              </Link>
            </VerticalMenu.Item>

            {isAdmin && (
              <>
                <MainMenuTitle>
                  {intl.formatMessage({
                    defaultMessage: 'ADMINISTRATION',
                    description: '[Main Menu] Administration title.',
                    id: 'MAIN_MENU__ADMINISTRATION_TITLE',
                  })}
                </MainMenuTitle>

                <VerticalMenu.Item isActive={router.pathname.startsWith('/import-export')} isDark>
                  <Link href="/import-export">
                    {intl.formatMessage({
                      defaultMessage: 'Import / Export',
                      description: '[Main Menu] Import / Export item.',
                      id: 'MAIN_MENU__IMPORT_EXPORT_ITEM',
                    })}
                  </Link>
                </VerticalMenu.Item>

                <VerticalMenu.Item isActive={router.pathname.startsWith('/personal-access-tokens')} isDark>
                  <Link href="/personal-access-tokens">
                    {intl.formatMessage({
                      defaultMessage: 'Personal Access Tokens',
                      description: '[Main Menu] Personal Access Tokens item.',
                      id: 'WL5w1n',
                    })}
                  </Link>
                </VerticalMenu.Item>

                <VerticalMenu.Item isActive={router.pathname.startsWith('/settings')} isDark>
                  <Link href="/settings">
                    {intl.formatMessage({
                      defaultMessage: 'Global Settings',
                      description: '[Main Menu] Settings item.',
                      id: 'MAIN_MENU__SETTINGS_ITEM',
                    })}
                  </Link>
                </VerticalMenu.Item>

                <VerticalMenu.Item isActive={router.pathname.startsWith('/users')} isDark>
                  <Link href="/users">
                    {intl.formatMessage({
                      defaultMessage: 'Users',
                      description: '[Main Menu] Users item.',
                      id: 'zGNJ13',
                    })}
                  </Link>
                </VerticalMenu.Item>
              </>
            )}
          </VerticalMenu>
        </MainMenu>
      </div>

      <UserMenu>
        <Link
          aria-label={intl.formatMessage({
            defaultMessage: 'My settings',
            description: '[Menu] Settings button aria label.',
            id: 'MENU__SETTINGS_BUTTON_ARIA_LABEL',
          })}
          href="/me"
        >
          <Settings />
        </Link>
        <LogOut
          aria-label={intl.formatMessage({
            defaultMessage: 'Log out',
            description: '[Menu] Log out button aria label.',
            id: 'MENU__LOG_OUT_BUTTON_ARIA_LABEL',
          })}
          onClick={auth.logOut}
          role="button"
        />
      </UserMenu>
    </Container>
  )
}
