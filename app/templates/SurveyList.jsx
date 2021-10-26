import { Button, Card, Table } from '@singularity-ui/core'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { Database, Edit, Eye, Trash } from 'react-feather'
import { useHistory } from 'react-router-dom'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Title from '../atoms/Title'
import getRandomId from '../helpers/getRandomId'
import slugify from '../helpers/slugify'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'

const BASE_COLUMNS = [
  {
    isSortable: true,
    key: 'title',
    label: 'Title',
  },
]

export default function SurveyList() {
  const [surveys, setSurveys] = useState([])
  const history = useHistory()
  const api = useApi()
  const isMounted = useIsMounted()

  const loadSurveys = async () => {
    const maybeBody = await api.get('surveys')
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    if (isMounted()) {
      setSurveys(maybeBody.data)
    }
  }

  useEffect(() => {
    loadSurveys()
  }, [])

  const goToSurveyEntryList = id => {
    history.push(`/survey/${id}/entries`)
  }

  const openSurvey = id => {
    const survey = R.find(R.propEq('_id', id))(surveys)

    window.open(`/public/survey/${survey.slug}`, '_blank')
  }

  const goToSurveyEditor = async id => {
    if (id === 'new') {
      const newSurveyTitle = `New Survey Title #${getRandomId()}`
      const newSurveySlug = slugify(newSurveyTitle)
      const newSurveyData = {
        slug: newSurveySlug,
        title: newSurveyTitle,
      }

      const maybeBody = await api.post('survey', newSurveyData)
      if (maybeBody === null || maybeBody.hasError) {
        return
      }

      history.push(`/survey/${maybeBody.data._id}`)

      return
    }

    history.push(`/survey/${id}`)
  }

  const deleteSurvey = async id => {
    await api.delete(`survey/${id}`)

    await loadSurveys()
  }

  const columns = [
    ...BASE_COLUMNS,
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
      accent: 'secondary',
      action: goToSurveyEditor,
      Icon: Edit,
      label: 'Edit this survey',
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
        <Title>Surveys</Title>

        <Button onClick={() => goToSurveyEditor('new')} size="small">
          New Survey
        </Button>
      </AdminHeader>

      <Card>
        <Table columns={columns} data={surveys} defaultSortedKey="lastName" />
      </Card>
    </AdminBox>
  )
}
