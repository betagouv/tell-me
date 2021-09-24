import { rehype } from 'rehype'
import rehypeSanitize from 'rehype-sanitize'

// https://github.com/syntax-tree/hast-util-sanitize#schema
// https://github.com/syntax-tree/hast-util-sanitize/blob/main/lib/schema.js
const SCHEMA = {
  tagNames: ['b', 'i'],
}

const sanitizeHtml = rehype().data('settings', {}).use(rehypeSanitize, SCHEMA).process

export default async function sanitizeRichText(html) {
  const sanitizedVFile = await sanitizeHtml(html)

  return sanitizedVFile.value
}
