module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['{api,app}/{hooks,libs}/**/*.ts', '**/helpers/**/*.{js,ts}', 'common/**/*.ts'],
  maxWorkers: '50%',
  preset: 'ts-jest',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: [
    // https://formatjs.io/docs/react-intl#jest
    '/node_modules/(?!intl-messageformat|@formatjs/icu-messageformat-parser).+\\.js$',
  ],
}
