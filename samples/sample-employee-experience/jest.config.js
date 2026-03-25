const { jsWithBabel: tsjPreset } = require('ts-jest/presets');

module.exports = {
    transform: {
        ...tsjPreset.transform
    },
    collectCoverage: false,
    testRegex: '(/__tests__/.*|(\\.|/)(tests))\\.(jsx?|tsx?|js?|ts?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testPathIgnorePatterns: ['node_modules'],
    transformIgnorePatterns: ['node_modules/?!(office-ui-fabric-react)'],
    moduleNameMapper: {},
    moduleDirectories: ['node_modules', 'src'],
    modulePathIgnorePatterns: [],
    setupFiles: ['<rootDir>/test.config.ts'],
    testResultsProcessor: '<rootDir>/test-result.config.js'
};
