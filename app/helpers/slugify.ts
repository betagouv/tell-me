import _slugify from 'slugify'

export function slugify(text: string, id?: string): string {
  return _slugify(text)
    .toLocaleLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .concat(id ? `-${id}` : '')
}
