import { handleApiError } from '@common/helpers/handleApiError'
import cors from 'cors'

export function withCors() {
  try {
    return cors({
      methods: ['GET'],
    })
  } catch (err) {
    return handleApiError(err, 'api/middleswares/withCors()')
  }
}
