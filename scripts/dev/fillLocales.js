import fastGlob from 'fast-glob'
import { promises as fs } from 'fs'
import * as R from 'ramda'

const sortPairByKeyCaseSensitive = R.sortBy(R.prop(0))
const mergeRightButDescription = R.curry((enUsLocale, foreignLocale) =>
  R.pipe(
    R.toPairs,
    R.reduce((newLocaleKeyPairs, [localeKey, enUsLocaleEntry]) => {
      if (!foreignLocale[localeKey]) {
        return newLocaleKeyPairs
      }

      return [
        ...newLocaleKeyPairs,
        [
          localeKey,
          {
            description: enUsLocaleEntry.description,
            message: foreignLocale[localeKey].message,
          },
        ],
      ]
    }, []),
    R.fromPairs,
  )(enUsLocale),
)

;(async () => {
  const localeFilePaths = await fastGlob('./locales/*.json')
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
