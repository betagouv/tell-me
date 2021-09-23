import { useEffect, useState } from 'react'
import styled from 'styled-components'

import useApi from '../../../hooks/useApi'
import Table from '../../organisms/Table'

const TABLE_COLUMNS = [
  {
    key: 'email',
    label: 'Email',
  },
]

const Container = styled.div`
  padding: 1.5rem;
`

export default function UsersList() {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const api = useApi()

  const loadUsers = async () => {
    const maybeBody = await api.get('users')
    if (maybeBody === null) {
      return
    }

    setUsers(maybeBody.data)
    setIsLoading(false)
  }

  const deleteUser = async id => {
    await api.delete(`user/${id}`)

    await loadUsers()
  }

  useEffect(() => {
    loadUsers()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Container>
        <Table
          columns={TABLE_COLUMNS}
          data={users}
          isLoading={isLoading}
          name="Survey"
          onDelete={deleteUser}
          path="survey"
          title="Users List"
        />
      </Container>
    </>
  )
}
