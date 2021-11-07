import { Button, Card, styled } from '@singularity-ui/core'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import ReactSpreadsheet from 'react-spreadsheet'

import { SURVEY_ENTRIES_DOWLOAD_EXTENSION } from '../../common/constants'
import AdminBox from '../atoms/AdminBox.tsx'
import AdminHeader from '../atoms/AdminHeader.tsx'
import Subtitle from '../atoms/Subtitle.tsx'
import Title from '../atoms/Title.tsx'
import useApi from '../hooks/useApi'
import useIsMounted from '../hooks/useIsMounted'
import Loader from '../molecules/Loader'

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  max-width: 100%;
`

const StyledReactSpreadsheet = styled(ReactSpreadsheet)`
  overflow: auto;
`

export default function SurveyEntryList() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [surveyEntries, setSurveyEntries] = useState(null)
  const [survey, setSurvey] = useState(null)
  const { id: surveyId } = useParams()
  const intl = useIntl()
  const api = useApi()
  const isMounted = useIsMounted()

  const isLoading = survey === null || surveyEntries === null

  const loadSurvey = async () => {
    const maybeBody = await api.get(`survey/${surveyId}`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    if (isMounted()) {
      setSurvey(maybeBody.data)
    }
  }

  const loadSurveyEntries = async () => {
    const maybeBody = await api.get(`survey/${surveyId}/entries`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const rawData = maybeBody.data
    const data = R.reduce(
      (data, entry) => {
        const { answers, createdAt } = entry
        const headers = [...data[0]]
        const values = [...data.slice(1)]

        const rowData = [createdAt, ...new Array(headers.length - 1).fill('')]
        answers.forEach(answer => {
          if (!headers.includes(answer.question)) {
            headers.push(answer.question)
            rowData.push(answer.values.join(', '))

            return
          }

          const headerIndex = R.findIndex(R.equals(answer.question))(headers)
          rowData[headerIndex] = answer.values.join(', ')
        })

        return [headers, ...values, rowData]
      },
      [['Date']],
    )(rawData)

    const spreadsheetData = data.map(dataRow => dataRow.map(value => ({ value })))

    if (isMounted()) {
      setSurveyEntries(spreadsheetData)
    }
  }

  useEffect(() => {
    loadSurvey()
    loadSurveyEntries()
  }, [])

  const download = async fileExtension => {
    if (isMounted()) {
      setIsDownloading(true)
    }

    const maybeBody = await api.get(`auth/one-time-token`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const { oneTimeToken } = maybeBody.data

    window.open(`/api/survey/${surveyId}/download?fileExtension=${fileExtension}&oneTimeToken=${oneTimeToken}`)

    if (isMounted()) {
      setIsDownloading(false)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <AdminBox>
      <AdminHeader>
        <Title>{survey.title}</Title>

        <Button disabled={isDownloading} onClick={() => download(SURVEY_ENTRIES_DOWLOAD_EXTENSION.CSV)} size="small">
          {intl.formatMessage({
            defaultMessage: 'Export as CSV',
            description: '[Survey Answers List] Export answers in CSV format button label.',
            id: 'YsRqXk',
          })}
        </Button>
      </AdminHeader>

      <StyledCard>
        <Subtitle>
          {intl.formatMessage({
            defaultMessage: 'Survey Answers',
            description: '[Survey Answers List] Survey answers list subtitle.',
            id: 'ZxR2Ts',
          })}
        </Subtitle>

        <StyledReactSpreadsheet data={surveyEntries} />
      </StyledCard>
    </AdminBox>
  )
}
