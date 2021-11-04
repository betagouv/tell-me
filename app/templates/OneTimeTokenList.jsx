import { Card, Table } from '@singularity-ui/core'
import { useEffect, useState } from 'react'
import { Trash } from 'react-feather'
import { useIntl } from 'react-intl'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Title from '../atoms/Title'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'

export default function OneTimeTokenList() {
  const [isLoading, setIsLoading] = useState(true)
  const [oneTimeTokens, setOneTimeTokens] = useState([])
  const intl = useIntl()
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
      label: intl.formatMessage({
        defaultMessage: 'Email',
        description: '[One Time Tokens List] Table "email" column label.',
        id: 'iMAa/d',
      }),
    },
    {
      isSortable: true,
      key: 'ip',
      label: intl.formatMessage({
        defaultMessage: 'IP',
        description: '[One Time Tokens List] Table "IP" column label.',
        id: 'TAgUUN',
      }),
    },
    {
      isSortable: true,
      key: 'ttl',
      label: intl.formatMessage({
        defaultMessage: 'TTL',
        description: '[One Time Tokens List] Table "TTL" column label.',
        id: 'yW/8Sz',
      }),
    },
    {
      accent: 'danger',
      action: deleteOneTimeToken,
      Icon: Trash,
      label: intl.formatMessage({
        defaultMessage: 'Delete this one time token',
        description: '[One Time Tokens List] Table row "token deletion" button label.',
        id: '73PR4k',
      }),
      type: 'action',
    },
  ]

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'One Time Tokens',
            description: '[One Time Tokens List] Page title.',
            id: '+6xdMp',
          })}
        </Title>
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
