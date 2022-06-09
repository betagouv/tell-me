import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { useApi } from '@app/hooks/useApi'
import { useIsMounted } from '@app/hooks/useIsMounted'
import { DeletionModal } from '@app/organisms/DeletionModal'
import { Button, Card, Table } from '@singularity/core'
import { TableColumnProps } from '@singularity/core/contents/Table/types'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { Edit, Trash } from 'react-feather'
import { useIntl } from 'react-intl'

export default function PersonalAccessTokenListPage() {
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [personalAccessTokens, setPersonalAccessTokens] = useState([])
  const router = useRouter()
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

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmPersonalAccessTokenDeletion = async (id: string): Promise<void> => {
    const personalAccessToken = R.find(R.propEq('id', id))(personalAccessTokens) as any

    setSelectedId(id)
    setSelectedEntity(personalAccessToken.label)
    setHasDeletionModal(true)
  }

  const deletePersonalAccessToken = async (): Promise<void> => {
    setHasDeletionModal(false)

    await api.delete(`personal-access-tokens/${selectedId}`)

    await loadPersonalAccessTokens()
  }

  const goToPersonalAccessTokenEditor = (id: string): void => {
    router.push(`/personal-access-tokens/${id}`)
  }

  useEffect(() => {
    loadPersonalAccessTokens()
  }, [])

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
      key: 'label',
      label: intl.formatMessage({
        defaultMessage: 'Label',
        description: '[Personal Access Tokens List] Table Label column label.',
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
      key: 'goToPersonalAccessTokenEditor',
      label: intl.formatMessage({
        defaultMessage: 'Edit this personal access token',
        description: '[Personal Access Tokens List] Table row edition button label.',
        id: 'ax3sGB',
      }),
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmPersonalAccessTokenDeletion,
      Icon: Trash,
      key: 'confirmPersonalAccessTokenDeletion',
      label: intl.formatMessage({
        defaultMessage: 'Delete this personal access token',
        description: '[Personal Access Tokens List] Table row deletion button label.',
        id: 'bVPj59',
      }),
      type: 'action',
    },
  ]

  return (
    <>
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

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deletePersonalAccessToken} />
      )}
    </>
  )
}
