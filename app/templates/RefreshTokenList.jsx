import { Card, Table } from '@singularity-ui/core'
import { useEffect, useState } from 'react'
import { Trash } from 'react-feather'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Title from '../atoms/Title'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'

export default function RefreshTokenList() {
  const [refreshTokens, setRefreshTokens] = useState([])
  const api = useApi()
  const isMounted = useIsMounted()

  const loadRefreshTokens = async () => {
    const maybeBody = await api.get('refresh-tokens')
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    if (isMounted()) {
      setRefreshTokens(maybeBody.data)
    }
  }

  const deleteOneTimeToken = async id => {
    await api.delete(`refresh-token/${id}`)

    await loadRefreshTokens()
  }

  useEffect(() => {
    loadRefreshTokens()
  }, [])

  const columns = [
    {
      isSortable: true,
      key: 'user.email',
      label: 'Email',
    },
    {
      isSortable: true,
      key: 'ip',
      label: 'IP',
    },
    {
      isSortable: true,
      key: 'ttl',
      label: 'TTL',
    },
    {
      accent: 'danger',
      action: deleteOneTimeToken,
      Icon: Trash,
      label: 'Delete this refresh token',
      type: 'action',
    },
  ]

  return (
    <AdminBox>
      <AdminHeader>
        <Title>Refresh Tokens</Title>
      </AdminHeader>

      <Card>
        <Table columns={columns} data={refreshTokens} defaultSortedKey="ttl" defaultSortedKeyIsDesc />
      </Card>
    </AdminBox>
  )
}
