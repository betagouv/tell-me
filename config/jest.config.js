export default {
  clearMocks: true,
  collectCoverageFrom: ['{api,app,common}/{helpers,hooks,libs}/**/*.ts'],
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
  transformIgnorePatterns: [],
}
