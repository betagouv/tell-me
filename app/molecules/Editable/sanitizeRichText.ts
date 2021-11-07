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

const sanitizeHtml = rehype().data('settings', {}).use(rehypeSanitize, SCHEMA).process

export default async function sanitizeRichText(source: string): Promise<string> {
  const sanitizedVFile = await sanitizeHtml(source)

  return sanitizedVFile.value as string
}
