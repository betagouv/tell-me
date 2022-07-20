import Ajv from 'ajv'

import { loadSchema } from '../helpers/loadSchema'

export const ajv = new Ajv({
  loadSchema,
  // TODO Pass AJV to sctrict mode once this error is fixed:
  // missing type "object" for keyword "properties" at "#/properties/data"
  // in TellMe.Data.schema.json
  strict: false,
})
