import { AdminHeader } from '@app/atoms/AdminHeader'
import { Flex } from '@app/atoms/Flex'
import { Icon } from '@app/atoms/Icon'
import { Title } from '@app/atoms/Title'
import { AdminFigure } from '@app/molecules/AdminFigure'
import { AdminBox } from '@app/organisms/AdminBox'
import { createWorkerFactory, terminate, useWorker } from '@shopify/react-web-worker'
import { useAuth } from 'nexauth/client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useIntl } from 'react-intl'

import { Statistics } from '../app/workers/statistics'

const createStatisticsWorker = createWorkerFactory(() => import('../app/workers/statistics'))

export default function DashboardPage() {
  const timerIdRef = useRef<NodeJS.Timer>()
  const [statistics, setStatistics] = useState<Statistics>({
    surveysCount: undefined,
    surveysEntriesCount: undefined,
  })
  const auth = useAuth()
  const intl = useIntl()
  const statisticsWorker = useWorker(createStatisticsWorker)

  const updateStatistics = useCallback(async () => {
    if (auth.user === undefined) {
      return
    }

    const newStatistics = await statisticsWorker.getStatistics(auth.state.accessToken)

    setStatistics({ ...newStatistics })
  }, [auth.state.accessToken])

  useEffect(() => {
    timerIdRef.current = setInterval(updateStatistics, 1000)

    return () => {
      clearInterval(timerIdRef.current)

      terminate(statisticsWorker)
    }
  }, [updateStatistics])

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'Dashboard',
            description: '[Dashboard Page] Title.',
            id: 'DASBOARD_PAGE__TITLE',
          })}
        </Title>
      </AdminHeader>

      <Flex>
        <AdminFigure
          icon={<Icon icon="ballot" />}
          label={intl.formatMessage({
            defaultMessage: 'Surveys',
            description: '[Dashboard Page] Surveys counter label.',
            id: 'DASBOARD_PAGE__SURVEYS_COUNTER_LABEL',
          })}
          value={statistics.surveysCount}
        />

        <AdminFigure
          icon={<Icon icon="how_to_vote" />}
          label={intl.formatMessage({
            defaultMessage: 'Submissions',
            description: '[Dashboard Page] Submissions counter label.',
            id: 'DASBOARD_PAGE__SUBMISSIONS_COUNTER_LABEL',
          })}
          value={statistics.surveysEntriesCount}
        />
      </Flex>
    </AdminBox>
  )
}
