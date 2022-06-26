import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { useApi } from '@app/hooks/useApi'
import { useIsMounted } from '@app/hooks/useIsMounted'
import { Loader } from '@app/molecules/Loader'
import { AdminBox } from '@app/organisms/AdminBox'
import { GlobalSettingsForm } from '@app/organisms/GlobalSettingsForm'
import { GlobalVariable } from '@prisma/client'
import * as R from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import type { GlobalSettingsFormValues } from '@app/organisms/GlobalSettingsForm'

export default function SettingsPage() {
  const api = useApi()
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<Partial<GlobalSettingsFormValues>>({})
  const intl = useIntl()
  const isMounted = useIsMounted()

  const load = useCallback(async () => {
    const maybeBody = await api.get<GlobalVariable[]>(`global-variables`)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const globalVariables = maybeBody.data
    const globalVariablesAsInitialValues = Object.fromEntries(globalVariables.map(({ key, value }) => [key, value]))

    if (isMounted()) {
      setInitialValues(globalVariablesAsInitialValues)
      setIsLoading(false)
    }
  }, [])

  const update = useCallback(async (values: Partial<GlobalSettingsFormValues>) => {
    const globalVariableKeys = R.keys(values)

    await Promise.all(
      globalVariableKeys.map(async globalVariableKey => {
        const value = values[globalVariableKey]
        const stringOrNullValue = typeof value === 'number' ? String(value) : value
        const normalizedValue =
          typeof stringOrNullValue === 'string' && stringOrNullValue.trim().length === 0 ? null : stringOrNullValue

        await api.patch(`global-variables/${globalVariableKey}`, {
          value: normalizedValue,
        })
      }),
    )

    return undefined
  }, [])

  useEffect(() => {
    load()
  }, [])

  if (isLoading) {
    return (
      <AdminBox>
        <Loader />
      </AdminBox>
    )
  }

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'Global Settings',
            description: '[Settings Page] Title.',
            id: 'SETTINGS_PAGE__TITLE',
          })}
        </Title>
      </AdminHeader>

      <GlobalSettingsForm initialValues={initialValues} onSubmit={update} />
    </AdminBox>
  )
}
