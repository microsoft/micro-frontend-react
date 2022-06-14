/* eslint-disable no-var */
var path = require('path');
var Webpack = require('webpack');
const { stringifyConfigValues, generateHTMLFile, generateDevServerSettings } = require('./WebpackConfigs.utils');

type GlobalVariables = { [key: string]: string | number | boolean };
type EntryConfig = { [key: string]: string };
type DevServerConfig = {
  devServerPort?: number;
  useHttps?: boolean;
  openBrowser?: boolean;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModuleRules = any[];
type Externals = { [key: string]: string };
type ExternalScripts = string[];

type BuildConfigOptions = {
  cwd: string;
  hostEntries?: EntryConfig;
  microFrontendEntries?: EntryConfig;
  buildOnceEntries?: EntryConfig;
  devServer?: DevServerConfig;
  globalVariables: GlobalVariables;
  moduleRules?: ModuleRules;
  externals?: Externals;
  externalScripts?: ExternalScripts;
  styles?: string;
};

module.exports = (options: BuildConfigOptions) => {
  const webpackConfigs = [];

  const hasHostEntries = !!options.hostEntries && Object.keys(options.hostEntries).length > 0;
  if (hasHostEntries) {
    if (Object.keys(options.hostEntries!).length > 1) throw new Error('There can be only one host app.');
    generateHTMLFile(options.cwd, Object.keys(options.hostEntries!)[0], options.externalScripts, options.styles);

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
        'react-router-dom': 'ReactRouterDOM',
        'styled-components': 'styled',
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
      plugins: [new Webpack.DefinePlugin(stringifyConfigValues(options.globalVariables))],
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
        'react-router-dom': 'ReactRouterDOM',
        'styled-components': 'styled',
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
      output: {
        path: path.join(options.cwd, 'public', 'bundles'),
        library: ['__MICRO_FRONTENDS__', '[name]'],
        chunkFilename: '[name].[hash].js',
        libraryTarget: 'umd',
        publicPath: `${options.globalVariables.__BASE_URL__}/bundles/`,
      },
      plugins: [new Webpack.DefinePlugin(stringifyConfigValues(options.globalVariables))],
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [path.resolve(options.cwd, 'node_modules'), 'node_modules'],
        fallback: { buffer: require.resolve('buffer/') },
      },
      devServer: hasHostEntries ? undefined : generateDevServerSettings(options.devServer),
    });
  }

  if (!!options.buildOnceEntries && Object.keys(options.buildOnceEntries).length > 0) {
    Object.keys(options.buildOnceEntries).forEach((p) => {
      generateHTMLFile(options.cwd, p, options.externalScripts, options.styles, true);
    });

    webpackConfigs.push({
      name: 'buildonce',
      target: 'web',
      mode: 'development',
      devtool: 'source-map',
      entry: options.buildOnceEntries,
      output: {
        path: path.join(options.cwd, 'public', 'buildonce'),
      },
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-router-dom': 'ReactRouterDOM',
        'styled-components': 'styled',
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
        ],
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [path.resolve(options.cwd, 'node_modules'), 'node_modules'],
        fallback: { buffer: require.resolve('buffer/') },
      },
      plugins: [new Webpack.DefinePlugin(stringifyConfigValues(options.globalVariables))],
      devServer: hasHostEntries
        ? undefined
        : {
            ...generateDevServerSettings(options.devServer),
            open: options.devServer?.openBrowser
              ? [`/buildonce/${Object.keys(options.buildOnceEntries)[0]}.html`]
              : false,
          },
    });
  }
  return webpackConfigs;
};
