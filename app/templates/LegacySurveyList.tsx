import { Button, Card, Table } from '@singularity-ui/core'
import { TableColumnProps } from '@singularity-ui/core/contents/Table/types'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { Copy, Database, Edit, Eye, Settings, Trash } from 'react-feather'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Title from '../atoms/Title'
import getRandomId from '../helpers/getRandomId'
import replaceMongoIds from '../helpers/replaceMongoIds'
import slugify from '../helpers/slugify'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'

export default function LegacySurveyList() {
  const [isLoading, setIsLoading] = useState(true)
  const [surveys, setSurveys] = useState([])
  const navigate = useNavigate()
  const intl = useIntl()
  const api = useApi()
  const isMounted = useIsMounted()

  const loadSurveys = async () => {
    const maybeBody = await api.get('legacy/surveys')
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
    navigate(`/legacy/survey/${id}/entries`)
  }

  const openSurvey = id => {
    const survey = R.find<any>(R.propEq('_id', id))(surveys)
    if (survey === undefined) {
      return
    }

    window.open(`/public/legacy/survey/${survey.slug}`, '_blank')
  }

  const goToSurveyEditor = async id => {
    if (id === 'new') {
      const newSurveyTitle = `New Survey Title #${getRandomId()}`
      const newSurveySlug = slugify(newSurveyTitle)
      const newSurveyData = {
        slug: newSurveySlug,
        title: newSurveyTitle,
      }

      const maybeBody = await api.post('legacy/survey', newSurveyData)
      if (maybeBody === null || maybeBody.hasError) {
        return
      }

      navigate(`/legacy/survey/${maybeBody.data._id}`)

      return
    }

    navigate(`/legacy/survey/${id}`)
  }

  const goToSurveyConfig = async id => {
    navigate(`/legacy/survey/${id}/config`)
  }

  const duplicateSurvey = async id => {
    const maybeGetBody = await api.get(`survey/${id}`)
    if (maybeGetBody === null || maybeGetBody.hasError) {
      return
    }

    const newSurvey = replaceMongoIds(maybeGetBody.data)
    newSurvey.title = `Copy #${getRandomId()} of ${newSurvey.title}`
    newSurvey.slug = slugify(newSurvey.title)

    const maybePostBody = await api.post('legacy/survey', newSurvey)
    if (maybePostBody === null || maybePostBody.hasError) {
      return
    }

    navigate(`/legacy/survey/${newSurvey._id}`)
  }

  const deleteSurvey = async id => {
    await api.delete(`legacy/survey/${id}`)

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
      label: 'View this survey results',
      type: 'action',
    },
    {
      accent: 'primary',
      action: openSurvey,
      Icon: Eye,
      label: 'Preview this survey',
      type: 'action',
    },
    {
      accent: 'primary',
      action: goToSurveyEditor,
      Icon: Edit,
      label: 'Edit this survey',
      type: 'action',
    },
    {
      accent: 'secondary',
      action: goToSurveyConfig,
      Icon: Settings,
      label: 'Edit this survey settings',
      type: 'action',
    },
    {
      accent: 'secondary',
      action: duplicateSurvey,
      Icon: Copy,
      label: 'Duplicate this survey',
      type: 'action',
    },
    {
      accent: 'danger',
      action: deleteSurvey,
      Icon: Trash,
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
