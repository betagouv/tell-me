import { Button, Card, Table } from '@singularity-ui/core'
import { useEffect, useState } from 'react'
import { Edit, Trash } from 'react-feather'
import { useHistory } from 'react-router-dom'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Title from '../atoms/Title'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'

const BASE_COLUMNS = [
  {
    isSortable: true,
    key: 'email',
    label: 'Email',
  },
  {
    isSortable: true,
    key: 'role',
    label: 'Role',
  },
  {
    key: 'isActive',
    label: '',
    type: 'boolean',
  },
]

export default function UserList() {
  const [users, setUsers] = useState([])
  const history = useHistory()
  const api = useApi()
  const isMounted = useIsMounted()

  const loadUsers = async () => {
    const maybeBody = await api.get('users')
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    if (isMounted()) {
      setUsers(maybeBody.data)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const goToUserEditor = id => {
    history.push(`/user/${id}`)
  }

  const columns = [
    ...BASE_COLUMNS,
    {
      accent: 'secondary',
      action: goToUserEditor,
      Icon: () => <Edit />,
      label: 'Edit this user',
      type: 'action',
    },
    {
      accent: 'danger',
      action: () => undefined,
      Icon: Trash,
      label: 'Delete this user',
      type: 'action',
    },
  ]

  return (
    <AdminBox>
      <AdminHeader>
        <Title>Users</Title>

        <Button onClick={() => goToUserEditor('new')} size="small">
          New User
        </Button>
      </AdminHeader>

      <Card>
        <Table columns={columns} data={users} defaultSortedKey="lastName" />
      </Card>
    </AdminBox>
  )
}
