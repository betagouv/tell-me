import fetch from './fetch'

export default async function loadSchema(schemaUrl: string): Promise<any> {
  const schema = await fetch(schemaUrl)

  return schema
}
