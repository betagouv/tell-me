import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import useApi from '@app/hooks/useApi'
import useIsMounted from '@app/hooks/useIsMounted'
import { Card, Table } from '@singularity/core'
import { TableColumnProps } from '@singularity/core/contents/Table/types'
import { useEffect, useState } from 'react'
import { Trash } from 'react-feather'
import { useIntl } from 'react-intl'

export default function OneTimeTokenListPage() {
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
    await api.delete(`one-time-tokens/${id}`)

    await loadOneTimeTokens()
  }

  useEffect(() => {
    loadOneTimeTokens()
  }, [])

  const columns: TableColumnProps[] = [
    {
      isSortable: true,
      key: 'user.email',
      label: intl.formatMessage({
        defaultMessage: 'Email',
        description: '[One Time Tokens List] Table Email column label.',
        id: 'iMAa/d',
      }),
    },
    {
      isSortable: true,
      key: 'ip',
      label: intl.formatMessage({
        defaultMessage: 'IP',
        description: '[One Time Tokens List] Table IP column label.',
        id: 'TAgUUN',
      }),
    },
    {
      isSortable: true,
      key: 'expiredAt',
      label: intl.formatMessage({
        defaultMessage: 'Expired at',
        description: '[One Time Tokens List] Table Expired At column label.',
        id: 'yW/8Sz',
      }),
    },
    {
      accent: 'danger',
      action: deleteOneTimeToken,
      Icon: Trash,
      key: 'deleteOneTimeToken',
      label: intl.formatMessage({
        defaultMessage: 'Delete this one time token',
        description: '[One Time Tokens List] Table row deletion button label.',
        id: '73PR4k',
      }),
      type: 'action',
    },
  ]

  return (
    <>
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
    </>
  )
}
