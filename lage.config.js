module.exports = {
  pipeline: {
    build: ['^build'],
    test: ['build'],
    lint: [],
    serve: ['^serve'],
  },
  npmClient: 'yarn',
};
