/* eslint-disable no-var */
var path = require('path');
var Webpack = require('webpack');
var { stringifyConfigValues, generateHTMLFile, generateDevServerSettings } = require('./WebpackConfigs.utils');

type GlobalVariables = { [key: string]: string | number | boolean };
type EntryConfig = { [key: string]: string };
type DevServerConfig = {
  devServerPort?: number;
  useHttps?: boolean;
  openBrowser?: boolean;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModuleRules = any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Plugins = any[];
type Externals = { [key: string]: string };
type ExternalScripts = string[];

type BuildConfigOptions = {
  cwd: string;
  hostEntries?: EntryConfig;
  microFrontendEntries?: EntryConfig;
  devServer?: DevServerConfig;
  globalVariables: GlobalVariables;
  moduleRules?: ModuleRules;
  plugins?: Plugins;
  externals?: Externals;
  externalScripts?: ExternalScripts;
  styles?: string;
  // Attach a query string to the script tag that loads the host app for cache bursting
  scriptQueryString?: string;
  contentSecurityPolicy?: string;
};

module.exports = (options: BuildConfigOptions) => {
  const webpackConfigs = [];

  const hasHostEntries = !!options.hostEntries && Object.keys(options.hostEntries).length > 0;
  if (hasHostEntries) {
    if (Object.keys(options.hostEntries!).length > 1) throw new Error('There can be only one host app.');
    generateHTMLFile(
      options.cwd,
      Object.keys(options.hostEntries!)[0],
      options.externalScripts,
      options.styles,
      options.scriptQueryString,
      options.contentSecurityPolicy
    );

    webpackConfigs.push({
      name: 'static',
      target: 'web',
      mode: 'development',
      devtool: 'source-map',
      entry: options.hostEntries,
      output: {
        path: path.join(options.cwd, 'public', 'bundles'),
      },
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        ...(options.externals || {}),
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
              transpileOnly: true,
            },
          },
          ...(options.moduleRules || []),
        ],
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [path.resolve(options.cwd, 'node_modules'), 'node_modules'],
        fallback: { buffer: require.resolve('buffer/') },
      },
      plugins: [new Webpack.DefinePlugin(stringifyConfigValues(options.globalVariables)), ...(options.plugins || [])],
      devServer: generateDevServerSettings(options.devServer),
    });
  }

  if (!!options.microFrontendEntries && Object.keys(options.microFrontendEntries).length > 0) {
    webpackConfigs.push({
      name: 'dynamic',
      target: 'web',
      mode: 'development',
      devtool: 'source-map',
      entry: options.microFrontendEntries,
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        ...(options.externals || {}),
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
              transpileOnly: true,
            },
            ...(options.moduleRules || []),
          },
        ],
      },
      output: {
        path: path.join(options.cwd, 'public', 'bundles'),
        library: ['__MICRO_FRONTENDS__', '[name]'],
        chunkFilename: '[name].[hash].js',
        libraryTarget: 'umd',
        publicPath: `${options.globalVariables.__BASE_URL__}/bundles/`,
      },
      plugins: [new Webpack.DefinePlugin(stringifyConfigValues(options.globalVariables)), ...(options.plugins || [])],
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [path.resolve(options.cwd, 'node_modules'), 'node_modules'],
        fallback: { buffer: require.resolve('buffer/') },
      },
      devServer: hasHostEntries ? undefined : generateDevServerSettings(options.devServer),
    });
  }

  return webpackConfigs;
};
