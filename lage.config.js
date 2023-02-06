module.exports = {
  pipeline: {
    build: ['^build'],
    test: ['build'],
    lint: [],
    serve: ['^serve'],
    'serve:redux': ['^serve:redux'],
    'serve:ee': ['^serve:ee'],
    clean: ['^clean'],
    release: ['^release'],
  },
  npmClient: 'yarn',
  priorities: [
    {
      package: '@micro-frontend-react/react',
      task: 'build',
      priority: 10,
    },
    {
      package: '@micro-frontend-react/redux',
      task: 'build',
      priority: 9,
    },
  ],
};
