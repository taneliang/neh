module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./setupJest.ts'],
  transform: {
    '\\.pug$': 'awesome-pug-jest',
    '\\.xml$': 'jest-raw-loader',
  },

  collectCoverageFrom: ['src/**/!(*.d).{js,jsx,ts,tsx}'],
  // Only write lcov files in CIs
  coverageReporters: ['text'].concat(process.env.CI ? 'json' : []),
};
