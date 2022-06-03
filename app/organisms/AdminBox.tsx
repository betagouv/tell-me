import Menu from '@app/organisms/Menu'
import styled from 'styled-components'

const Page = styled.div`
  display: flex;
  flex-grow: 1;
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 16rem;
  min-height: 0;
  min-width: 0;
  padding: 1rem;
`

export function AdminBox({ children }) {
  return (
    <Page>
      <Menu />

      <Main>{children}</Main>
    </Page>
  )
}
