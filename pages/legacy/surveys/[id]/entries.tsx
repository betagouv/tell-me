import getFileExtension from '@api/helpers/getFileExtension'
import AdminHeader from '@app/atoms/AdminHeader'
import Subtitle from '@app/atoms/Subtitle'
import Title from '@app/atoms/Title'
import capitalizeFirstLetter from '@app/helpers/capitalizeFirstLetter'
import useApi from '@app/hooks/useApi'
import useIsMounted from '@app/hooks/useIsMounted'
import { Loader } from '@app/molecules/Loader'
import { SURVEY_ENTRIES_DOWLOAD_EXTENSION } from '@common/constants'
import getDayjs from '@common/helpers/getDayjs'
import { Button, Card, Table } from '@singularity/core'
import { TableColumnProps } from '@singularity/core/contents/Table/types'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
`

const StyledTable = styled(Table)`
  tbody > tr > td {
    vertical-align: top;
  }

  tbody > tr > td:not(:first-child) {
    width: 40%;
  }
`

const Source = styled.div`
  > div:not(:first-child) {
    padding-top: 0.5rem;
  }

  button {
    margin-top: 0.25rem;
    padding: 0.125rem 0.375rem;
    text-transform: uppercase;
  }
`

export default function LegacySurveyEntryListPage() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [surveyEntries, setSurveyEntries] = useState<any>(null)
  const [survey, setSurvey] = useState<any>(null)
  const api = useApi()
  const intl = useIntl()
  const isMounted = useIsMounted()
  const router = useRouter()

  const { id: surveyId } = router.query

  const dayjs = getDayjs()
  const isLoading = survey === null || surveyEntries === null

  const downloadAsset = async (url: string, mimeType: string): Promise<void> => {
    if (/^https:\/\/[^/]+\.amazonaws\.com\//.test(url)) {
      // eslint-disable-next-line no-console
      console.warn('Amazon AWS S3 is not yet supported here.')

      return
    }

    const maybeBody = await api.get('auth/one-time-token')
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const { oneTimeToken } = maybeBody.data

    window.open(`${url}?mimeType=${mimeType}&oneTimeToken=${oneTimeToken}`, '')
  }

  const exportEntries = async fileExtension => {
    if (isMounted()) {
      setIsDownloading(true)
    }

    const maybeBody = await api.get(`auth/one-time-token`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const { oneTimeToken } = maybeBody.data

    window.open(`/api/legacy/surveys/${surveyId}/download?fileExtension=${fileExtension}&oneTimeToken=${oneTimeToken}`)

    if (isMounted()) {
      setIsDownloading(false)
    }
  }

  const loadSurvey = async () => {
    const maybeBody = await api.get(`legacy/surveys/${surveyId}`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    if (isMounted()) {
      setSurvey(maybeBody.data)
    }
  }

  const loadSurveyEntries = async () => {
    const maybeBody = await api.get(`legacy/surveys/${surveyId}/entries`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const rawData = maybeBody.data
    const data = R.map(({ _id: id, answers, files, updatedAt }: any) => {
      const library = files.map(({ _id, mimeType, question, url }) => (
        <div key={_id}>
          <p>
            <b>{question}</b>
          </p>
          <p>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Button accent="secondary" onClick={() => downloadAsset(url, mimeType)} size="small">
              {getFileExtension(url)}
            </Button>
          </p>
        </div>
      ))

      const source = answers.map(({ _id, question, values }) => (
        <div key={_id}>
          <p>
            <b>{question}</b>
          </p>
          <p>{values.join(', ')}</p>
        </div>
      ))

      return {
        id,
        library: <Source>{library}</Source>,
        source: <Source>{source}</Source>,
        updatedAt,
      }
    })(rawData)

    if (isMounted()) {
      setSurveyEntries(data)
    }
  }

  useEffect(() => {
    loadSurvey()
    loadSurveyEntries()
  }, [])

  const columns: TableColumnProps[] = [
    {
      isSortable: true,
      key: 'updatedAt',
      label: intl.formatMessage({
        defaultMessage: 'Date',
        description: '[Survey Answers List] Table Date column label.',
        id: 's1Q3aH',
      }),
      transform: ({ updatedAt }) => capitalizeFirstLetter(dayjs(updatedAt).fromNow()),
    },
    {
      key: 'source',
      label: intl.formatMessage({
        defaultMessage: 'Answers',
        description: '[Survey Answers List] Table Answers column label.',
        id: '6StYcj',
      }),
    },
    {
      key: 'library',
      label: intl.formatMessage({
        defaultMessage: 'Files',
        description: '[Survey Answers List] Table Files column label.',
        id: 'Dus0RS',
      }),
    },
  ]

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <AdminHeader>
        <Title>{survey.title}</Title>

        <Button
          disabled={isDownloading}
          onClick={() => exportEntries(SURVEY_ENTRIES_DOWLOAD_EXTENSION.CSV)}
          size="small"
        >
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

        <StyledTable columns={columns} data={surveyEntries} defaultSortedKey="updatedAt" defaultSortedKeyIsDesc />
      </StyledCard>
    </>
  )
}
