const generateBuildConfig = require('@microsoft/micro-frontend-react/lib/WebpackConfigs');

const devServerPort = 9000;
const useHttps = false;
const openBrowser = true;

const globalVariables = {
  /* =========================
   * Add build time variables here
   * These variables also need to added in ./global.d.ts file to be available in Typescript
   * ====================== */

  __APP_NAME__: 'Micro-Frontend Host Application',
};

const hostEntries = {
  /* =========================
   * Add Webpack entry for host application
   * ====================== */

  app: './src/App.tsx',
};

module.exports = generateBuildConfig({
  cwd: __dirname,
  hostEntries,
  devServer: {
    devServerPort,
    useHttps,
    openBrowser,
  },
  globalVariables,
});
