module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['{api,app}/{hooks,libs}/**/*.ts', '**/helpers/**/*.{js,ts}', 'common/**/*.ts'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      useESM: true,
    },
  },
  maxWorkers: '50%',
  preset: 'ts-jest',
  rootDir: '..',
  setupFiles: ['dotenv/config'],
  testMatch: ['**/*.test.ts'],
  transformIgnorePatterns: [
    // https://formatjs.io/docs/react-intl#jest
    '/node_modules/(?!intl-messageformat|@formatjs/icu-messageformat-parser).+\\.js$',
  ],
}
