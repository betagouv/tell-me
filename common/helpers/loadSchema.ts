import ky from 'ky-universal'

import type { AnySchemaObject } from 'ajv'

export async function loadSchema(schemaUrl: string): Promise<AnySchemaObject> {
  const response = await ky.get(schemaUrl)
  const schema = await response.json()

  return schema
}
