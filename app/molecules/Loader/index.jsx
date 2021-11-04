import { useIntl } from 'react-intl'

import Overlay from './Overlay'

export default function Loader() {
  const intl = useIntl()

  return (
    <Overlay>
      {intl.formatMessage({
        defaultMessage: 'Loading…',
        description: '[Generic Locales] Loading text.',
        id: 'hUbkme',
      })}
    </Overlay>
  )
}
