import { Button, Card, Table } from '@singularity-ui/core'
import { TableColumnProps } from '@singularity-ui/core/contents/Table/types'
import { useEffect, useState } from 'react'
import { Edit, Trash } from 'react-feather'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Title from '../atoms/Title'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'

export default function PersonalAccessTokenList() {
  const [isLoading, setIsLoading] = useState(true)
  const [personalAccessTokens, setPersonalAccessTokens] = useState([])
  const navigate = useNavigate()
  const intl = useIntl()
  const api = useApi()
  const isMounted = useIsMounted()

  const loadPersonalAccessTokens = async (): Promise<void> => {
    const maybeBody = await api.get('personal-access-tokens')
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    if (isMounted()) {
      setPersonalAccessTokens(maybeBody.data)
      setIsLoading(false)
    }
  }

  const deletePersonalAccessToken = async (id: string): Promise<void> => {
    await api.delete(`personal-access-token/${id}`)

    await loadPersonalAccessTokens()
  }

  useEffect(() => {
    loadPersonalAccessTokens()
  }, [])

  const goToPersonalAccessTokenEditor = (id: string): void => {
    navigate(`/personal-access-token/${id}`)
  }

  const columns: TableColumnProps[] = [
    {
      isSortable: true,
      key: 'user.email',
      label: intl.formatMessage({
        defaultMessage: 'Email',
        description: '[Personal Access Tokens List] Table Email column label.',
        id: 'KahMf6',
      }),
    },
    {
      isSortable: true,
      key: 'name',
      label: intl.formatMessage({
        defaultMessage: 'Name',
        description: '[Personal Access Tokens List] Table Name column label.',
        id: 'TYZzVl',
      }),
    },
    {
      isSortable: true,
      key: 'expiredAt',
      label: intl.formatMessage({
        defaultMessage: 'Expired at',
        description: '[Personal Access Tokens List] Table Expired At column label.',
        id: 'j3Zg1g',
      }),
    },
    {
      accent: 'primary',
      action: goToPersonalAccessTokenEditor,
      Icon: Edit,
      label: intl.formatMessage({
        defaultMessage: 'Edit this personal access token',
        description: '[Personal Access Tokens List] Table row edition button label.',
        id: 'ax3sGB',
      }),
      type: 'action',
    },
    {
      accent: 'danger',
      action: deletePersonalAccessToken,
      Icon: Trash,
      label: intl.formatMessage({
        defaultMessage: 'Delete this personal access token',
        description: '[Personal Access Tokens List] Table row deletion button label.',
        id: 'bVPj59',
      }),
      type: 'action',
    },
  ]

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'Personal Access Tokens',
            description: '[Personal Access Tokens List] Page title.',
            id: 'HF2UUz',
          })}
        </Title>

        <Button onClick={() => goToPersonalAccessTokenEditor('new')} size="small">
          {intl.formatMessage({
            defaultMessage: 'New personal access token',
            description: '[Personal Access Tokens List] New personal access token button label.',
            id: 'NIzhyl',
          })}
        </Button>
      </AdminHeader>

      <Card>
        <Table
          columns={columns}
          data={personalAccessTokens}
          defaultSortedKey="name"
          defaultSortedKeyIsDesc
          isLoading={isLoading}
        />
      </Card>
    </AdminBox>
  )
}
