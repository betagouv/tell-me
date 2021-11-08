import ky from 'ky'

import handleError from './handleError'

export default async function isFirstSetup(): Promise<Common.Nullable<boolean>> {
  try {
    const {
      data: { isReady },
    } = await ky.get('/api').json()

    return !isReady
  } catch (err) {
    handleError(err, 'helpers/isFirstSetup()')

    return null
  }
}