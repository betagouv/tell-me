import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'

import isFirstSetup from '../app/helpers/isFirstSetup'
import resetLocalStorage from '../app/helpers/resetLocalStorage'
import useAuth from '../app/hooks/useAuth'
import useIsMounted from '../app/hooks/useIsMounted'
import Loader from '../app/molecules/Loader'
import LoginModal from '../app/organisms/LoginModal'
import Menu from '../app/organisms/Menu'
import SetupModal from '../app/organisms/SetupModal'
import Dashboard from '../app/templates/Dashboard'
import LegacySurveyConfig from '../app/templates/LegacySurveyConfig'
import LegacySurveyEditor from '../app/templates/LegacySurveyEditor'
import LegacySurveyEntryList from '../app/templates/LegacySurveyEntryList'
import LegacySurveyList from '../app/templates/LegacySurveyList'
import MyConfig from '../app/templates/MyConfig'
import OneTimeTokenList from '../app/templates/OneTimeTokenList'
import PersonalAccessTokenEditor from '../app/templates/PersonalAccessTokenEditor'
import PersonalAccessTokenList from '../app/templates/PersonalAccessTokenList'
import RefreshTokenList from '../app/templates/RefreshTokenList'
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
  const [mustSetup, setMustSetup] = useState<Common.Nullable<boolean>>(null)
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
    return (
      <Page>
        <Loader />
      </Page>
    )
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
          <Routes>
            <Route element={<MyConfig />} path="/me" />

            <Route element={<OneTimeTokenList />} path="/one-time-tokens" />

            <Route element={<PersonalAccessTokenEditor />} path="/personal-access-token/:id" />
            <Route element={<PersonalAccessTokenList />} path="/personal-access-tokens" />

            <Route element={<RefreshTokenList />} path="/refresh-tokens" />

            <Route element={<SurveyList />} path="/surveys" />
            <Route element={<SurveyEditor />} path="/survey/:id" />
            {/* <Route element={<SurveyConfig />} path="/survey/:id/config" /> */}
            <Route element={<SurveyEntryList />} path="/survey/:id/entries" />

            <Route element={<UserEditor />} path="/user/:id" />
            <Route element={<UsersList />} path="/users" />

            <Route element={<LegacySurveyList />} path="/legacy/surveys" />
            <Route element={<LegacySurveyEditor />} path="/legacy/survey/:id" />
            <Route element={<LegacySurveyConfig />} path="/legacy/survey/:id/config" />
            <Route element={<LegacySurveyEntryList />} path="/legacy/survey/:id/entries" />

            <Route element={<Dashboard />} path="/" />
          </Routes>
        </Main>
      </Page>
    </BrowserRouter>
  )
}
