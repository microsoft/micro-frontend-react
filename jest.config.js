const { jsWithBabel: tsjPreset } = require('ts-jest/presets');

module.exports = {
  transform: {
    ...tsjPreset.transform,
  },
  testRegex: '(/__tests__/.*|(\\.|/)(tests))\\.(jsx?|tsx?|js?|ts?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testPathIgnorePatterns: ['node_modules'],
  transformIgnorePatterns: ['node_modules/?!(@fluentui/react)'],
  moduleNameMapper: {},
  moduleDirectories: ['node_modules', 'src'],
  modulePathIgnorePatterns: [],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['<rootDir>/test.config.ts'],
  testResultsProcessor: '<rootDir>/test-result.config.js',
  coverageReporters: ['cobertura', 'text'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/lib/**',
    '!**/*.types.ts',
    '!**/*.action-types.ts',
    '!**/*.styled.ts',
    '!**/*.actions.ts',
    '!**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
};
