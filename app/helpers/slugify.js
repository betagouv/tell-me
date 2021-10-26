import rawSlugify from 'slugify'

export default function slugify(text) {
  return rawSlugify(text).toLowerCase()
}
