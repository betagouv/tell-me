/* eslint-disable react/prop-types */

import styled from 'styled-components'

import Header from '../atoms/Header'
import Logo from '../atoms/Logo'
import Title from '../atoms/Title'

const Page = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 960px;
`

export default function PublicSurvey({ data }) {
  const { title } = data

  return (
    <Page>
      <Header />

      <Container>
        <Logo />
        <Title>{title}</Title>
      </Container>
    </Page>
  )
}
