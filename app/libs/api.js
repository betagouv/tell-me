import ky from 'ky'

const API_BASE_URL = '/api'

class Api {
  constructor() {
    this.ky = ky.create({
      prefixUrl: API_BASE_URL,
    })
  }

  updateAuthorizationBearer(sessionToken) {
    if (sessionToken === null) {
      return
    }

    this.ky = this.ky.extend({
      headers: {
        authorization: `Bearer ${sessionToken}`,
      },
    })
  }
}

export default new Api()
