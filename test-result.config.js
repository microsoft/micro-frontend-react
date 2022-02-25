var builder = require('jest-trx-results-processor/dist/testResultsProcessor');

var processor = builder({
  outputFile: 'test-results.trx',
});

module.exports = processor;
