const generateBuildConfig = require('@micro-frontend-react/employee-experience/lib/WebpackConfigs');

const devServerPort = 9000;
const useHttps = true;
const openBrowser = true;

const globalVariables = {
  /* =========================
   * Add build time variables here
   * These variables also need to added in ./global.d.ts file to be available in Typescript
   * ====================== */

  __IS_DEVELOPMENT__: process.env.NODE_ENV === 'development' || true,
  __APP_NAME__: 'Employee Experience Generator',
  __BASE_URL__: process.env.baseUrl || `http${useHttps ? 's' : ''}://localhost:${devServerPort}`,

  __CLIENT_ID__: process.env.clientId || 'e3bc175b-276c-4b4e-8b6d-0795de028111',
  __INSTRUMENTATION_KEY__: process.env.instrumentationKey || '958d6073-76a5-443a-9901-9ec4c35c030e',
};

const hostEntries = {
  /* =========================
   * Add Webpack entry for host application
   * ====================== */

  app: './src/App.tsx',
};

const microFrontendEntries = {
  /* =========================
   * Add Webpack entry for micro-frontend applications
   * ====================== */

  'dynamic-redux-hooks': './src/Samples/DynamicReduxHooks/DynamicReduxHooks.tsx',
  'dynamic-sub-routes': './src/Samples/DynamicSubRoutes/DynamicSubRoutes.tsx',
  'code-splitting': './src/Samples/CodeSplitting/CodeSplitting.tsx',
  'dynamic-route-param-consumer': './src/Samples/DynamicSubRoutes/DynamicRouteParamConsumer.tsx',
};

module.exports = generateBuildConfig({
  cwd: __dirname,
  hostEntries,
  microFrontendEntries,
  devServer: {
    devServerPort,
    useHttps,
    openBrowser,
  },
  globalVariables,
  externals: {
    'react-router-dom': 'ReactRouterDOM',
  },
  externalScripts: [
    'https://ee.azureedge.net/react/17.0.2/react.production.min.js',
    'https://ee.azureedge.net/react/17.0.2/react-is.production.min.js',
    'https://ee.azureedge.net/react/17.0.2/react-dom.production.min.js',
    'https://ee.azureedge.net/react-router-dom/5.3.0/react-router-dom.min.js',
    'https://ee.azureedge.net/styled-components/5.3.3/styled-components.min.js',
  ],
});
