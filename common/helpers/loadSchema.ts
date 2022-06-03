import ky from 'ky-universal'

export async function loadSchema(schemaUrl: string): Promise<Common.Pojo> {
  const response = await ky.get(schemaUrl)
  const schema = await response.json()

  return schema
}
