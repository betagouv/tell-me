/* eslint-disable no-bitwise, no-plusplus */

/**
 * @param {string} text
 *
 * @return {string}
 *
 * @see https://stackoverflow.com/a/7616484/2736233
 */
export default function hashCode(text) {
  let hash = 0

  if (text.length === 0) {
    return hash
  }

  for (let i = 0; i < text.length; i++) {
    const textChar = text.charCodeAt(i)
    hash = (hash << 5) - hash + textChar
    hash |= 0 // Convert to 32bit integer
  }

  return hash
}
