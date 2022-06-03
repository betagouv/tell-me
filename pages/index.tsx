import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import isFirstSetup from '@app/helpers/isFirstSetup'
import resetLocalStorage from '@app/helpers/resetLocalStorage'
import useIsMounted from '@app/hooks/useIsMounted'
import { Loader } from '@app/molecules/Loader'
import SetupModal from '@app/organisms/SetupModal'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

export default function SpaPage() {
  const [mustSetup, setMustSetup] = useState<Common.Nullable<boolean>>(null)
  const intl = useIntl()
  const isMounted = useIsMounted()

  const checkSetup = async () => {
    const mustSetup = await isFirstSetup()

    if (mustSetup) {
      // We clear any locally stored data
      resetLocalStorage()
    }

    if (isMounted()) {
      setMustSetup(mustSetup)
    }
  }

  useEffect(() => {
    checkSetup()
  }, [])

  if (mustSetup === null) {
    return <Loader />
  }

  if (mustSetup) {
    return <SetupModal onDone={checkSetup} />
  }

  return (
    <AdminHeader>
      <Title>
        {intl.formatMessage({
          defaultMessage: 'Dashboard',
          description: '[Dashboard] Page title.',
          id: '/2pv6j',
        })}
      </Title>
    </AdminHeader>
  )
}
