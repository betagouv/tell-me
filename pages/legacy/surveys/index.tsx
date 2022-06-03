import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import getRandomId from '@app/helpers/getRandomId'
import replaceMongoIds from '@app/helpers/replaceMongoIds'
import slugify from '@app/helpers/slugify'
import useApi from '@app/hooks/useApi'
import useIsMounted from '@app/hooks/useIsMounted'
import { Button, Card, Table } from '@singularity/core'
import { TableColumnProps } from '@singularity/core/contents/Table/types'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { Copy, Database, Edit, Eye, Settings, Trash } from 'react-feather'
import { useIntl } from 'react-intl'

export default function LegacySurveyListPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [surveys, setSurveys] = useState([])
  const router = useRouter()
  const intl = useIntl()
  const api = useApi()
  const isMounted = useIsMounted()

  const loadSurveys = async () => {
    const maybeBody = await api.get('legacy/surveys')
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const newSurveys = maybeBody.data.map(({ _id, ...rest }) => ({
      id: _id,
      ...rest,
    }))

    if (isMounted()) {
      setSurveys(newSurveys)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSurveys()
  }, [])

  const goToSurveyEntryList = id => {
    router.push(`/legacy/surveys/${id}/entries`)
  }

  const openSurvey = id => {
    const survey = R.find<any>(R.propEq('id', id))(surveys)
    if (survey === undefined) {
      return
    }

    window.open(`/public/legacy/surveys/${survey.slug}`, '_blank')
  }

  const goToSurveyEditor = async id => {
    if (id === 'new') {
      const newSurveyTitle = `New Survey Title #${getRandomId()}`
      const newSurveySlug = slugify(newSurveyTitle)
      const newSurveyData = {
        slug: newSurveySlug,
        title: newSurveyTitle,
      }

      const maybeBody = await api.post('legacy/surveys', newSurveyData)
      if (maybeBody === null || maybeBody.hasError) {
        return
      }

      router.push(`/legacy/surveys/${maybeBody.data._id}`)

      return
    }

    router.push(`/legacy/surveys/${id}`)
  }

  const goToSurveyConfig = async id => {
    router.push(`/legacy/surveys/${id}/config`)
  }

  const duplicateSurvey = async id => {
    const maybeGetBody = await api.get(`legacy/surveys/${id}`)
    if (maybeGetBody === null || maybeGetBody.hasError) {
      return
    }

    const newSurvey = replaceMongoIds(maybeGetBody.data)
    newSurvey.title = `Copy #${getRandomId()} of ${newSurvey.title}`
    newSurvey.slug = slugify(newSurvey.title)

    const maybePostBody = await api.post('legacy/surveys', newSurvey)
    if (maybePostBody === null || maybePostBody.hasError) {
      return
    }

    router.push(`/legacy/surveys/${newSurvey._id}`)
  }

  const deleteSurvey = async id => {
    await api.delete(`legacy/surveys/${id}`)

    await loadSurveys()
  }

  const columns: TableColumnProps[] = [
    {
      isSortable: true,
      key: 'title',
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
    <>
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
    </>
  )
}
