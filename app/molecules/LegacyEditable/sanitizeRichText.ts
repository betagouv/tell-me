import { rehype } from 'rehype'
import rehypeSanitize from 'rehype-sanitize'

// https://github.com/syntax-tree/hast-util-sanitize#schema
// https://github.com/syntax-tree/hast-util-sanitize/blob/main/lib/schema.js
const SCHEMA = {
  attributes: {
    a: ['href', 'target'],
  },
  tagNames: ['a', 'b', 'i'],
}

const sanitizeHtml = rehype()
  .data('settings', {
    fragment: true,
  })
  .use(rehypeSanitize, SCHEMA).processSync

export default function sanitizeRichText(source: string): string {
  const sanitizedVFile = sanitizeHtml(source)
  const sanitizedSource = String(sanitizedVFile)

  return sanitizedSource
}
