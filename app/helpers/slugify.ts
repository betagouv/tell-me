import rawSlugify from 'slugify'

export function slugify(text: string): string {
  return rawSlugify(text).toLowerCase()
}
