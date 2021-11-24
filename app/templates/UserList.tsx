import { Card, Table } from '@singularity-ui/core'
import { TableColumnProps } from '@singularity-ui/core/contents/Table/types'
import { useEffect, useState } from 'react'
import { Edit, Trash, UserCheck, UserX } from 'react-feather'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Title from '../atoms/Title'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'

export default function UserList() {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const history = useHistory()
  const intl = useIntl()
  const api = useApi()
  const isMounted = useIsMounted()

  const loadUsers = async (): Promise<void> => {
    const maybeBody = await api.get('users')
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    if (isMounted()) {
      setUsers(maybeBody.data)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const goToUserEditor = (id: string): void => {
    history.push(`/user/${id}`)
  }

  const columns: TableColumnProps[] = [
    {
      isSortable: true,
      key: 'email',
      label: intl.formatMessage({
        defaultMessage: 'Email',
        description: '[Users List] Table "email" column label.',
        id: 'QBtMwD',
      }),
    },
    {
      isSortable: true,
      key: 'role',
      label: intl.formatMessage({
        defaultMessage: 'Role',
        description: '[Users List] Table "role" column label.',
        id: 'kx4x9D',
      }),
    },
    {
      IconOff: UserX,
      IconOn: UserCheck,
      key: 'isActive',
      label: 'Activated',
      labelOff: 'This user account is inactive.',
      labelOn: 'This user account is active.',
      type: 'boolean',
    },
    {
      accent: 'primary',
      action: goToUserEditor,
      Icon: () => <Edit />,
      label: intl.formatMessage({
        defaultMessage: 'Edit this user',
        description: '[Users List] Table row "user edition" button label.',
        id: '4toEG',
      }),
      type: 'action',
    },
    {
      accent: 'danger',
      action: () => undefined,
      Icon: Trash,
      label: intl.formatMessage({
        defaultMessage: 'Delete this user',
        description: '[Users List] Table row "user deletion" button label.',
        id: '8F0yyx',
      }),
      type: 'action',
    },
  ]

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'Users',
            description: '[Users List] Page title.',
            id: '8vxOf',
          })}
        </Title>
      </AdminHeader>

      <Card>
        <Table columns={columns} data={users} defaultSortedKey="lastName" isLoading={isLoading} />
      </Card>
    </AdminBox>
  )
}
