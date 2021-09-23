import ky from 'ky'

import handleError from './handleError'

// eslint-disable-next-line consistent-return
export default async function isFirstSetup() {
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
