import { styled } from '@singularity-ui/core'
import { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import isFirstSetup from '../app/helpers/isFirstSetup'
import resetLocalStorage from '../app/helpers/resetLocalStorage'
import useAuth from '../app/hooks/useAuth'
import useIsMounted from '../app/hooks/useIsMounted'
import Loader from '../app/molecules/Loader'
import LoginModal from '../app/organisms/LoginModal'
import Menu from '../app/organisms/Menu'
import SetupModal from '../app/organisms/SetupModal'
import Dashboard from '../app/templates/Dashboard'
import MyConfig from '../app/templates/MyConfig'
import SurveyEditor from '../app/templates/SurveyEditor'
import SurveyEntryList from '../app/templates/SurveyEntryList'
import SurveyList from '../app/templates/SurveyList'
import UserEditor from '../app/templates/UserEditor'
import UsersList from '../app/templates/UserList'

const Page = styled.div`
  display: flex;
  flex-grow: 1;
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 16rem;
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

    if (mustSetup) {
      // We clear any locally stored data
      resetLocalStorage()
    }

    if (isMounted()) {
      setMustSetup(mustSetup)
    }
  }

  useEffect(() => {
    checkSetup()
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

        <Main>
          <Switch>
            <Route path="/me">
              <MyConfig />
            </Route>

            <Route path="/survey/:id/entries">
              <SurveyEntryList />
            </Route>
            <Route path="/survey/:id">
              <SurveyEditor />
            </Route>
            <Route path="/surveys">
              <SurveyList />
            </Route>

            <Route path="/user/:id">
              <UserEditor />
            </Route>
            <Route path="/users">
              <UsersList />
            </Route>

            <Route path="/">
              <Dashboard />
            </Route>
          </Switch>
        </Main>
      </Page>
    </BrowserRouter>
  )
}
