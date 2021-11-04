import { Card, Table } from '@singularity-ui/core'
import { useEffect, useState } from 'react'
import { Trash } from 'react-feather'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Title from '../atoms/Title'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'

export default function OneTimeTokenList() {
  const [isLoading, setIsLoading] = useState(true)
  const [oneTimeTokens, setOneTimeTokens] = useState([])
  const api = useApi()
  const isMounted = useIsMounted()

  const loadOneTimeTokens = async () => {
    const maybeBody = await api.get('one-time-tokens')
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    if (isMounted()) {
      setOneTimeTokens(maybeBody.data)
      setIsLoading(false)
    }
  }

  const deleteOneTimeToken = async id => {
    await api.delete(`one-time-token/${id}`)

    await loadOneTimeTokens()
  }

  useEffect(() => {
    loadOneTimeTokens()
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
      label: 'Delete this one time token',
      type: 'action',
    },
  ]

  return (
    <AdminBox>
      <AdminHeader>
        <Title>One Time Tokens</Title>
      </AdminHeader>

      <Card>
        <Table
          columns={columns}
          data={oneTimeTokens}
          defaultSortedKey="ttl"
          defaultSortedKeyIsDesc
          isLoading={isLoading}
        />
      </Card>
    </AdminBox>
  )
}
