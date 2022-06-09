import Ajv from 'ajv'

import { loadSchema } from '../helpers/loadSchema'

export const ajv = new Ajv({
  loadSchema,
  strict: false,
})
