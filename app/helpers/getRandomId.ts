export function getRandomId(): string {
  const randomId = String(window.crypto.getRandomValues(new Uint32Array(1))[0]).padStart(10, '0')

  return randomId
}
