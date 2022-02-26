module.exports = {
  pipeline: {
    build: ['^build'],
    test: ['build'],
    lint: [],
    serve: ['^serve'],
    'serve:redux': ['^serve:redux'],
    clean: ['^clean'],
  },
  npmClient: 'yarn',
};
