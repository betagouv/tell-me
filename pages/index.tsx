import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { AdminBox } from '@app/organisms/AdminBox'
import { useIntl } from 'react-intl'

export default function DashboardPage() {
  const intl = useIntl()

  return (
    <AdminBox>
      <AdminHeader>
        <Title>
          {intl.formatMessage({
            defaultMessage: 'Dashboard',
            description: '[Dashboard] Page title.',
            id: 'dashboard.page.title',
          })}
        </Title>
      </AdminHeader>
    </AdminBox>
  )
}
