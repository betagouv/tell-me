module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['{api,app}/{hooks,libs}/**/*.{js,ts}', '**/helpers/**/*.{js,ts}', 'common/**/*.{js,ts}'],
  maxWorkers: '50%',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: [
    // https://formatjs.io/docs/react-intl#jest
    '/node_modules/(?!intl-messageformat|@formatjs/icu-messageformat-parser).+\\.js$',
  ],
}
