export default function resetLocalStorage(): void {
  const maybeLocale = window.localStorage.getItem('locale')

  window.localStorage.clear()

  if (maybeLocale !== null) {
    window.localStorage.setItem('locale', maybeLocale)
  }
}
