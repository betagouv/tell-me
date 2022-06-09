export function getRandomId(): string {
  const randomId = String(window.crypto.getRandomValues(new Uint32Array(1))[0]).substr(5, 5)
  if (randomId.length < 5) {
    return getRandomId()
  }

  return randomId
}
