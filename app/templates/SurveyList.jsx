import { Button, Card, Table } from '@singularity-ui/core'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { Edit, Eye, Trash } from 'react-feather'
import { useHistory } from 'react-router-dom'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Title from '../atoms/Title'
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

  const openSurvey = id => {
    const survey = R.find(R.propEq('_id', id))(surveys)

    window.open(`/public/survey/${survey.slug}`, '_blank')
  }

  const goToSurveyEditor = id => {
    history.push(`/survey/${id}`)
  }

  const deleteSurvey = async id => {
    await api.delete(`survey/${id}`)

    await loadSurveys()
  }

  const columns = [
    ...BASE_COLUMNS,
    {
      accent: 'secondary',
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
