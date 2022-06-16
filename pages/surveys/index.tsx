import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { generateTellMeTree } from '@app/helpers/generateTellMeTree'
import { getRandomId } from '@app/helpers/getRandomId'
import { slugify } from '@app/helpers/slugify'
import { useApi } from '@app/hooks/useApi'
import { useIsMounted } from '@app/hooks/useIsMounted'
import { SurveyEditorManager } from '@app/libs/SurveyEditorManager'
import { AdminBox } from '@app/organisms/AdminBox'
import { Button, Card, Table } from '@singularity/core'
import { TableColumnProps } from '@singularity/core/contents/Table/types'
import cuid from 'cuid'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import { Copy, Database, Edit, Eye, Settings, Trash } from 'react-feather'
import { useIntl } from 'react-intl'

import type { Prisma, Survey } from '@prisma/client'
import type { TellMe } from '@schemas/1.0.0/TellMe'

export default function SurveyListPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [surveys, setSurveys] = useState([])
  const router = useRouter()
  const intl = useIntl()
  const api = useApi()
  const isMounted = useIsMounted()

  const loadSurveys = async () => {
    const maybeBody = await api.get('surveys')
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    if (isMounted()) {
      setSurveys(maybeBody.data)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSurveys()
  }, [])

  const goToSurveyEntryList = id => {
    router.push(`/surveys/${id}/entries`)
  }

  const openSurvey = id => {
    const survey = R.find<any>(R.propEq('id', id))(surveys)
    if (survey === undefined) {
      return
    }

    window.open(`/public/surveys/${survey.slug}`, '_blank')
  }

  const goToSurveyEditor = async (idOrNew: string) => {
    if (idOrNew === 'new') {
      const newSurveyEditorManager = new SurveyEditorManager()

      const id = cuid()
      const language = intl.locale
      const title = `New Survey Title #${getRandomId()}`
      const slug = slugify(title)
      const tree: any = generateTellMeTree({
        backgroundUri: null,
        blocks: newSurveyEditorManager.blocks,
        coverUri: null,
        id,
        language,
        logoUri: null,
        title,
      })
      const data: any = {
        entries: [],
        id,
        language,
        title,
        version: '1.0.0',
      } as TellMe.Data

      const newSurveyData: Prisma.SurveyCreateInput = {
        data,
        id,
        slug,
        tree,
      }

      const maybeBody = await api.post('surveys', newSurveyData)
      if (maybeBody === null || maybeBody.hasError) {
        return
      }

      router.push(`/surveys/${maybeBody.data.id}`)

      return
    }

    router.push(`/surveys/${idOrNew}`)
  }

  const goToSurveyConfig = async (id: string) => {
    router.push(`/surveys/${id}/config`)
  }

  const duplicateSurvey = useCallback(async (sourceSurveyId: string) => {
    const response = await api.get<
      Omit<Survey, 'data' | 'tree'> & {
        data: TellMe.Data
        tree: TellMe.Tree
      }
    >(`surveys/${sourceSurveyId}`)
    if (response === null || response.hasError) {
      return
    }

    const sourceSurvey = response.data
    const id = cuid()
    const title = `Copy #${getRandomId()} of ${sourceSurvey.tree.data.title}`
    const slug = slugify(title)
    const tree: any = {
      ...sourceSurvey.tree,
      data: {
        ...sourceSurvey.tree.data,
        title,
      },
      id,
    } as TellMe.Tree
    const data: any = {
      ...sourceSurvey.data,
      entries: [],
      id,
      title,
    } as TellMe.Data

    const destinationSurvey: Prisma.SurveyCreateInput = {
      data,
      id,
      slug,
      tree,
    }

    const maybePostBody = await api.post('surveys', destinationSurvey)
    if (maybePostBody === null || maybePostBody.hasError) {
      return
    }

    router.push(`/surveys/${id}`)
  }, [])

  const deleteSurvey = async (id: string) => {
    await api.delete(`surveys/${id}`)

    await loadSurveys()
  }

  const columns: TableColumnProps[] = [
    {
      isSortable: true,
      key: 'tree.data.title',
      label: intl.formatMessage({
        defaultMessage: 'Title',
        description: '[Surveys List] Table "title" column label.',
        id: '91i3BC',
      }),
    },
    {
      accent: 'success',
      action: goToSurveyEntryList,
      Icon: Database,
      key: 'goToSurveyEntryList',
      label: 'View this survey results',
      type: 'action',
    },
    {
      accent: 'primary',
      action: openSurvey,
      Icon: Eye,
      key: 'openSurvey',
      label: 'Preview this survey',
      type: 'action',
    },
    {
      accent: 'primary',
      action: goToSurveyEditor,
      Icon: Edit,
      key: 'goToSurveyEditor',
      label: 'Edit this survey',
      type: 'action',
    },
    {
      accent: 'secondary',
      action: goToSurveyConfig,
      Icon: Settings,
      key: 'goToSurveyConfig',
      label: 'Edit this survey settings',
      type: 'action',
    },
    {
      accent: 'secondary',
      action: duplicateSurvey,
      Icon: Copy,
      key: 'duplicateSurvey',
      label: 'Duplicate this survey',
      type: 'action',
    },
    {
      accent: 'danger',
      action: deleteSurvey,
      Icon: Trash,
      key: 'deleteSurvey',
      label: 'Delete this survey',
      type: 'action',
    },
  ]

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'Survey',
            description: '[Surveys List] Page title.',
            id: 'tnYUFj',
          })}
        </Title>

        <Button onClick={() => goToSurveyEditor('new')} size="small">
          {intl.formatMessage({
            defaultMessage: 'New survey',
            description: '[Surveys List] New survey button label.',
            id: 'IEpCqZ',
          })}
        </Button>
      </AdminHeader>

      <Card>
        <Table columns={columns} data={surveys} defaultSortedKey="lastName" isLoading={isLoading} />
      </Card>
    </AdminBox>
  )
}
