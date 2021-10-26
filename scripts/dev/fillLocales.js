const { promises: fs } = require('fs')
const glob = require('glob')
const R = require('ramda')
const { promisify } = require('util')

const asyncGlob = promisify(glob)

const sortPairByKeyCaseSensitive = R.sortBy(R.prop(0))

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
        R.mergeRight(enUsLocale),
        R.toPairs,
        sortPairByKeyCaseSensitive,
        R.fromPairs,
      )(locale)

      const newLocaleSource = JSON.stringify(newLocale, null, 2)
      await fs.writeFile(localeFilePath, newLocaleSource, 'utf-8')
    })(nonEnUsLocaleFilePaths),
  )
})()
