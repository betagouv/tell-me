import rawSlugify from 'slugify'

export default function slugify(text: string): string {
  return rawSlugify(text).toLowerCase()
}
