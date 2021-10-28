export default function resetLocalStorage() {
  const maybeLocale = window.localStorage.getItem('locale')
  window.localStorage.clear()
  if (maybeLocale !== null) {
    window.localStorage.setItem('locale', maybeLocale)
  }
}
