export type LocalizationContext = {
  locale: Common.Nullable<string>
  refresh: (newLocale: string) => void
}
