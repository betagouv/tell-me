export default {
  clearMocks: true,
  collectCoverageFrom: ['{api,app}/{hooks,libs}/**/*.ts', '**/helpers/**/*.{js,ts}', 'common/**/*.ts'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  maxWorkers: '50%',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@api/(.*)$': '<rootDir>/api/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@schemas/(.*)$': '<rootDir>/schemas/$1',
  },
  rootDir: '..',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.ts'],
  testMatch: ['**/*.test.{ts,tsx}'],
  transform: {
    '.*\\.(j|t)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  transformIgnorePatterns: [
    // https://formatjs.io/docs/react-intl#jest
    '/node_modules/(?!intl-messageformat|@formatjs/icu-messageformat-parser).+\\.js$',
  ],
}
