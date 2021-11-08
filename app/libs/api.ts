import ky from 'ky'
import { ky as Ky } from 'ky/distribution/types/ky'

const API_BASE_URL = '/api'

class Api {
  public ky: Ky

  constructor() {
    this.ky = ky.create({
      prefixUrl: API_BASE_URL,
    })
  }

  updateAuthorizationBearer(sessionToken: Common.Nullable<string>): void {
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
