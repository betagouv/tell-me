import { useIntl } from 'react-intl'

import AdminBox from '../atoms/AdminBox'
import AdminHeader from '../atoms/AdminHeader'
import Title from '../atoms/Title'

export default function Dashboard() {
  const intl = useIntl()

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'Dashboard',
            description: '[Dashboard] Page title.',
            id: '/2pv6j',
          })}
        </Title>
      </AdminHeader>
    </AdminBox>
  )
}
