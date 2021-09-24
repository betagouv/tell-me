import { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import styled from 'styled-components'

import Loader from '../app-bo/components/molecules/Loader'
import Header from '../app-bo/components/organisms/Header'
import LoginModal from '../app-bo/components/organisms/LoginModal'
import Menu from '../app-bo/components/organisms/Menu'
import SetupModal from '../app-bo/components/organisms/SetupModal'
import Dashboard from '../app-bo/components/templates/Dashboard'
import SurveyEditor from '../app-bo/components/templates/SurveyEditor'
import SurveysList from '../app-bo/components/templates/SurveysList'
import UsersList from '../app-bo/components/templates/UsersList'
import isFirstSetup from '../app-bo/helpers/isFirstSetup'
import useAuth from '../app-bo/hooks/useAuth'
import useIsMounted from '../app-bo/hooks/useIsMounted'

const Page = styled.div`
  display: flex;
  flex-grow: 1;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

/**
 * Tell Me Back-Office Web Application
 *
 * @description
 * This is the main application served as a SPA while generated surveys are served as SSR to optimize their rendering.
 *
 * @see https://colinhacks.com/essays/building-a-spa-with-nextjs
 */
export default function SpaPage() {
  const { state: authState } = useAuth()
  const [mustSetup, setMustSetup] = useState(null)
  const isMounted = useIsMounted()

  const checkSetup = async () => {
    const mustSetup = await isFirstSetup()

    if (isMounted()) {
      setMustSetup(mustSetup)
    }
  }

  useEffect(() => {
    checkSetup()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (mustSetup === null || authState.isLoading) {
    return <Loader />
  }

  if (mustSetup) {
    return <SetupModal onDone={checkSetup} />
  }

  if (!authState.isAuthenticated) {
    return <LoginModal />
  }

  return (
    <BrowserRouter>
      <Page>
        <Menu />

        <Body>
          <Header />

          <Main>
            <Switch>
              <Route path="/surveys">
                <SurveysList />
              </Route>
              <Route path="/survey/:id">
                <SurveyEditor />
              </Route>
              <Route path="/users">
                <UsersList />
              </Route>
              <Route path="/">
                <Dashboard />
              </Route>
            </Switch>
          </Main>
        </Body>
      </Page>
    </BrowserRouter>
  )
}
