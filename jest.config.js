// https://nextjs.org/docs/testing#jest-and-react-testing-library

module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['{api,app}/{hooks,libs}/**/*.js', '**/helpers/**/*.{js,jsx}', 'common/**/*.js'],
  maxWorkers: '50%',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    /* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
}
