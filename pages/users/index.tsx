import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { useApi } from '@app/hooks/useApi'
import { useIsMounted } from '@app/hooks/useIsMounted'
import { AdminBox } from '@app/organisms/AdminBox'
import { Card, Table } from '@singularity/core'
import { TableColumnProps } from '@singularity/core/contents/Table/types'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Edit, Trash, UserCheck, UserX } from 'react-feather'
import { useIntl } from 'react-intl'

export default function UserListPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const router = useRouter()
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
    router.push(`/users/${id}`)
  }

  const columns: TableColumnProps[] = [
    {
      isSortable: true,
      key: 'email',
      label: intl.formatMessage({
        defaultMessage: 'Email',
        description: '[Users List] Table Email column label.',
        id: 'QBtMwD',
      }),
    },
    {
      isSortable: true,
      key: 'role',
      label: intl.formatMessage({
        defaultMessage: 'Role',
        description: '[Users List] Table Role column label.',
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
      Icon: Edit,
      key: 'goToUserEditor',
      label: intl.formatMessage({
        defaultMessage: 'Edit this user',
        description: '[Users List] Table row edition button label.',
        id: '4toEG',
      }),
      type: 'action',
    },
    {
      accent: 'danger',
      action: () => undefined,
      Icon: Trash,
      key: 'deleteUser',
      label: intl.formatMessage({
        defaultMessage: 'Delete this user',
        description: '[Users List] Table row deletion button label.',
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
