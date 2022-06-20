export type LocalizationContext = {
  locale: string | null
  refresh: (newLocale: string) => void
}
