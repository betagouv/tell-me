import { promises as fs } from 'fs'
import glob from 'glob'
import * as R from 'ramda'
import { promisify } from 'util'

const asyncGlob = promisify(glob)

const sortPairByKeyCaseSensitive = R.sortBy(R.prop(0))
const mergeRightButDescription = R.curry((enUsLocale, foreignLocale) =>
  R.pipe(
    R.toPairs,
    R.map(([localeKey, enUsLocaleEntry]) => {
      const foreignLocaleEntry = { ...foreignLocale[localeKey] }
      const enUsLocaleEntryWithoutDescription = R.omit(['description'])(enUsLocaleEntry)
      const newForeignLocaleEntry = R.mergeRight(enUsLocaleEntryWithoutDescription)(foreignLocaleEntry)
      newForeignLocaleEntry.description = String(enUsLocaleEntry.description)

      return [localeKey, newForeignLocaleEntry]
    }),
    R.fromPairs,
  )(enUsLocale),
)

;(async () => {
  const localeFilePaths = await asyncGlob('./locales/*.json')
  const nonEnUsLocaleFilePaths = R.reject(R.endsWith('en-US.json'))(localeFilePaths)

  const enUsLocaleSource = await fs.readFile('./locales/en-US.json', 'utf-8')
  const enUsLocale = JSON.parse(enUsLocaleSource)
  const enUsLocaleIds = R.keys(enUsLocale)

  await Promise.all(
    R.forEach(async localeFilePath => {
      const localeSource = await fs.readFile(localeFilePath, 'utf-8')
      const locale = JSON.parse(localeSource)

      const newLocale = R.pipe(
        R.toPairs,
        R.reject(([id]) => !enUsLocaleIds.includes(id)),
        R.fromPairs,
        mergeRightButDescription(enUsLocale),
        R.toPairs,
        sortPairByKeyCaseSensitive,
        R.fromPairs,
      )(locale)

      const newLocaleSource = JSON.stringify(newLocale, null, 2)
      await fs.writeFile(localeFilePath, newLocaleSource, 'utf-8')
    })(nonEnUsLocaleFilePaths),
  )
})()
