import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { useIntl } from 'react-intl'

export default function SpaPage() {
  const intl = useIntl()

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
