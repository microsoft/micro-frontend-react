/* eslint-disable no-var */
var fs = require('fs');
var path = require('path');

module.exports = {
  stringifyConfigValues: (config: { [key: string]: any }) => {
    const result: { [key: string]: string } = {};
    Object.keys(config).forEach((key) => {
      result[key] = JSON.stringify(config[key]);
    });

    return result;
  },

  generateHTMLFile: (
    cwd: string,
    fileName: string,
    externalScripts: string[] = [],
    styles = '',
    scriptQueryString: string | null = null,
    contentSecurityPolicy = null
  ) => {
    const basePath = path.join(cwd, 'public');

    fs.mkdirSync(basePath, { recursive: true });
    fs.writeFileSync(
      path.join(basePath, 'index.html'),
      `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${contentSecurityPolicy ? `<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}" />` : ''}
        <style>${styles}</style>
    </head>
    <body>
        <div id="app"></div>

        ${(externalScripts || []).map((p) => `<script src="${p}"></script>`).join('')}
        
        <script src="/bundles/${fileName}.js${scriptQueryString != null ? `?${scriptQueryString}` : ''}"></script>
    </body>
</html>`
    );
  },

  generateDevServerSettings: (devServerOptions: {
    devServerPort?: number;
    useHttps?: boolean;
    openBrowser?: boolean;
  }) => {
    return {
      compress: true,
      port: devServerOptions?.devServerPort ?? 9000,
      historyApiFallback: true,
      https: !!devServerOptions?.useHttps ?? false,
      devMiddleware: {
        writeToDisk: true,
      },
      open: devServerOptions?.openBrowser ?? true,
    };
  },
};
