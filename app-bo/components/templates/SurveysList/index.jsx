import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import slugify from 'slugify'
import styled from 'styled-components'

import getRandomId from '../../../helpers/getRandomId'
import useApi from '../../../hooks/useApi'
import Table from '../../organisms/Table'

const TABLE_COLUMNS = [
  {
    key: 'title',
    label: 'Title',
  },
]

const Container = styled.div`
  padding: 1.5rem;
`

export default function SurveysList() {
  const [isLoading, setIsLoading] = useState(true)
  const [surveys, setSurveys] = useState([])
  const history = useHistory()
  const api = useApi()

  const loadSurveys = async () => {
    const maybeBody = await api.get('surveys')
    if (maybeBody === null) {
      return
    }

    setSurveys(maybeBody.data)
    setIsLoading(false)
  }

  const addSurvey = async () => {
    const newSurveyTitle = `New Survey Title #${getRandomId()}`
    const newSurveySlug = slugify(newSurveyTitle)
    const newSurveyData = {
      slug: newSurveySlug,
      title: newSurveyTitle,
    }

    const body = await api.post('survey', newSurveyData)

    history.push(`/survey/${body.data._id}`)
  }

  const deleteSurvey = async id => {
    await api.delete(`survey/${id}`)

    await loadSurveys()
  }

  useEffect(() => {
    loadSurveys()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Container>
        <Table
          columns={TABLE_COLUMNS}
          data={surveys}
          hasPreview
          isLoading={isLoading}
          name="Survey"
          onAdd={addSurvey}
          onDelete={deleteSurvey}
          path="survey"
          title="Surveys List"
        />
      </Container>
    </>
  )
}
