import { Card, Table } from '@singularity-ui/core'
import { TableColumnProps } from '@singularity-ui/core/contents/Table/types'
import { useEffect, useState } from 'react'
import { Trash } from 'react-feather'
import { useIntl } from 'react-intl'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Title from '../atoms/Title'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'

export default function RefreshTokenList() {
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTokens, setRefreshTokens] = useState([])
  const intl = useIntl()
  const api = useApi()
  const isMounted = useIsMounted()

  const loadRefreshTokens = async () => {
    const maybeBody = await api.get('refresh-tokens')
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    if (isMounted()) {
      setRefreshTokens(maybeBody.data)
      setIsLoading(false)
    }
  }

  const deleteOneTimeToken = async id => {
    await api.delete(`refresh-token/${id}`)

    await loadRefreshTokens()
  }

  useEffect(() => {
    loadRefreshTokens()
  }, [])

  const columns: TableColumnProps[] = [
    {
      isSortable: true,
      key: 'user.email',
      label: intl.formatMessage({
        defaultMessage: 'Email',
        description: '[Refresh Tokens List] Table "email" column label.',
        id: 'jGB2t1',
      }),
    },
    {
      isSortable: true,
      key: 'ip',
      label: intl.formatMessage({
        defaultMessage: 'IP',
        description: '[Refresh Tokens List] Table "IP" column label.',
        id: '20hT19',
      }),
    },
    {
      isSortable: true,
      key: 'ttl',
      label: intl.formatMessage({
        defaultMessage: 'TTL',
        description: '[Refresh Tokens List] Table "TTL" column label.',
        id: '+lem9Q',
      }),
    },
    {
      accent: 'danger',
      action: deleteOneTimeToken,
      Icon: Trash,
      label: intl.formatMessage({
        defaultMessage: 'Delete this refresh token',
        description: '[Refresh Tokens List] Table row "token deletion" button label.',
        id: 'uaDzBk',
      }),
      type: 'action',
    },
  ]

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'Refresh Tokens',
            description: '[Refresh Tokens List] Page title.',
            id: 'Ikt38A',
          })}
        </Title>
      </AdminHeader>

      <Card>
        <Table
          columns={columns}
          data={refreshTokens}
          defaultSortedKey="ttl"
          defaultSortedKeyIsDesc
          isLoading={isLoading}
        />
      </Card>
    </AdminBox>
  )
}
