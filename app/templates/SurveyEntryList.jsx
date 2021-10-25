import { Button, Card } from '@singularity-ui/core'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactSpreadsheet from 'react-spreadsheet'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Title from '../atoms/Title'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'

export default function SurveyEntryList() {
  const [surveyData, setSurveyData] = useState([])
  const { id: surveyId } = useParams()
  const api = useApi()
  const isMounted = useIsMounted()

  const loadSurveyEntries = async () => {
    const maybeBody = await api.get(`survey/${surveyId}/entries`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const rawData = maybeBody.data
    const data = R.reduce(
      (data, entry) => {
        const { answers, createdAt } = entry
        const headers = data[0]
        const values = data.slice(1)

        const rowData = [createdAt, new Array(headers.length).fill('')]
        answers.forEach(answer => {
          if (!headers.includes(answer.question)) {
            headers.push(answer.question)
            rowData.push(answer.answers.join(', '))

            return
          }

          const headerIndex = R.findIndex(R.equals(answer.question))(headers)
          rowData[headerIndex] = answer.answers.join(', ')
        })

        return [headers, ...values, rowData]
      },
      [['Date']],
    )(rawData)

    const spreadsheetData = data.map(dataRow => dataRow.map(value => ({ value })))

    if (isMounted()) {
      setSurveyData(spreadsheetData)
    }
  }

  useEffect(() => {
    loadSurveyEntries()
  }, [])

  return (
    <AdminBox>
      <AdminHeader>
        <Title>Survey Entries</Title>

        <Button onClick={() => undefined} size="small">
          Export CSV
        </Button>
      </AdminHeader>

      <Card>
        {surveyData.length === 0 && 'Loading...'}
        {surveyData.length !== 0 && <ReactSpreadsheet data={surveyData} />}
      </Card>
    </AdminBox>
  )
}
