const path = require('path');
const Webpack = require('webpack');
const fs = require('fs');

type GlobalVariables = { [key: string]: string | number | boolean };
type EntryConfig = { [key: string]: string };
type DevServerConfig = {
  devServerPort?: number;
  useHttps?: boolean;
  openBrowser?: boolean;
};

type BuildConfigOptions = {
  cwd: string;
  hostEntries?: EntryConfig;
  microFrontendEntries?: EntryConfig;
  buildOnceEntries?: EntryConfig;
  devServer?: DevServerConfig;
  globalVariables: GlobalVariables;
};

module.exports = (options: BuildConfigOptions) => {
  console.log(options.cwd);
  const webpackConfigs = [];

  function stringifyConfigValues(config: { [key: string]: any }) {
    const result: { [key: string]: string } = {};
    Object.keys(config).forEach((key) => {
      result[key] = JSON.stringify(config[key]);
    });

    return result;
  }

  function generateHTMLFile(cwd: string, fileName: string, isHostApp = false) {
    const basePath = path.join(cwd, 'public', isHostApp ? '' : 'buildonce');

    fs.mkdirSync(basePath, { recursive: true });
    fs.writeFileSync(
      path.join(basePath, `${isHostApp ? 'index' : fileName}.html`),
      `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
            rel="stylesheet"
            href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/10.0.0/css/fabric.min.css"
        />
    </head>
    <body class="ms-Fabric" dir="ltr">
        <div id="app"></div>

        <script src="https://ee.azureedge.net/react/17.0.2/react.production.min.js"></script>
        <script src="https://ee.azureedge.net/react/17.0.2/react-is.production.min.js"></script>
        <script src="https://ee.azureedge.net/react/17.0.2/react-dom.production.min.js"></script>
        
        ${isHostApp ? `<script src="/${fileName}.js"></script>` : `<script src="/buildonce/${fileName}.js"></script>`}
    </body>
</html>`
    );
  }

  const hasHostEntries = !!options.hostEntries && Object.keys(options.hostEntries).length > 0;
  if (hasHostEntries) {
    if (Object.keys(options.hostEntries!).length > 1) throw new Error('There can be only one host app.');

    generateHTMLFile(options.cwd, Object.keys(options.hostEntries!)[0], true);

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
      devServer: {
        compress: true,
        port: options.devServer?.devServerPort ?? 9000,
        historyApiFallback: true,
        https: !!options.devServer?.useHttps ?? false,
        devMiddleware: {
          writeToDisk: true,
        },
        open: options.devServer?.openBrowser ?? true,
      },
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
      devServer: hasHostEntries
        ? undefined
        : {
            compress: true,
            port: options.devServer?.devServerPort ?? 9000,
            historyApiFallback: true,
            https: options.devServer?.useHttps ?? false,
            devMiddleware: {
              writeToDisk: true,
            },
            open: options.devServer?.openBrowser ?? false,
          },
    });
  }

  if (!!options.buildOnceEntries && Object.keys(options.buildOnceEntries).length > 0) {
    Object.keys(options.buildOnceEntries).forEach((p) => {
      generateHTMLFile(options.cwd, p);
    });

    webpackConfigs.push({
      name: 'myhub',
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
            compress: true,
            port: options.devServer?.devServerPort ?? 9000,
            historyApiFallback: true,
            https: options.devServer?.useHttps ?? false,
            devMiddleware: {
              writeToDisk: true,
            },
            open: options.devServer?.openBrowser
              ? [`/buildonce/${Object.keys(options.buildOnceEntries)[0]}.html`]
              : false,
          },
    });
  }

  return webpackConfigs;
};
