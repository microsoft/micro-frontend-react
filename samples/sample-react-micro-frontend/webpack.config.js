const generateBuildConfig = require('@micro-frontend-react/core/lib/WebpackConfigs');

const devServerPort = 8000;
const useHttps = false;
const openBrowser = false;

const globalVariables = {
  /* =========================
   * Add build time variables here
   * These variables also need to added in ./global.d.ts file to be available in Typescript
   * ====================== */

  __APP_NAME__: 'Micro-Frontend Application',
};

const microFrontendEntries = {
  /* =========================
   * Add Webpack entry for host application
   * ====================== */

  'micro-frontend-app': './src/MicroFrontendApp.tsx',
};

module.exports = generateBuildConfig({
  cwd: __dirname,
  microFrontendEntries,
  devServer: {
    devServerPort,
    useHttps,
    openBrowser,
  },
  globalVariables,
});
