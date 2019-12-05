module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/!(*.d).{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  // Only write lcov files in CIs
  coverageReporters: ['text'].concat(process.env.CI ? 'json' : []),
};
