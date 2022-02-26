import { ComponentType } from 'react';
import { IHttpClient, IComponentLoader, IComponentConfig, ITelemetryClient, IComponentProps } from '../Models';
import { IDuplicateRequestHandlers } from './ComponentLoader.types';

export class ComponentLoader implements IComponentLoader {
  private readonly telemetryClient: ITelemetryClient | undefined;
  private readonly httpClient: IHttpClient | undefined;
  // Keeps track of same script being requested multiple times at once
  private duplicateRequestHandlers: IDuplicateRequestHandlers = {};

  constructor(telemetryClient: ITelemetryClient, httpClient: IHttpClient | undefined) {
    this.telemetryClient = telemetryClient;
    this.httpClient = httpClient;

    window.__WIDGETS__ = window.__WIDGETS__ || {};
  }

  public async loadCommon(scriptLocation: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script: HTMLScriptElement = document.createElement('script');
      script.onload = (): void => {
        resolve();
      };
      script.onerror = reject;
      script.src = scriptLocation;
      document.body.appendChild(script);
    });
  }

  public async load(config: IComponentConfig): Promise<ComponentType<IComponentProps>> {
    return new Promise(
      (resolve: (componentType: ComponentType<IComponentProps>) => void, reject: (error: Error) => void): void => {
        if (!this.isValidComponentConfig(config)) return;

        const fileName =
          !config.fileName || config.fileName.length == 0 ? this.getFileName(config.script) : config.fileName;

        if (this.isComponentLoaded(fileName, config.name)) {
          return resolve(this.getComponentTemplate(fileName, config.name));
        }

        if (this.duplicateRequestHandlers.hasOwnProperty(fileName)) {
          this.duplicateRequestHandlers[fileName].push({
            resolve,
            reject,
          });

          return;
        }

        this.duplicateRequestHandlers[fileName] = this.duplicateRequestHandlers[fileName] || [];
        const script: HTMLScriptElement = document.createElement('script');

        script.onload = (): void => {
          if (this.isComponentLoaded(fileName, config.name)) {
            const template = this.getComponentTemplate(fileName, config.name);

            resolve(template);
            this.duplicateRequestHandlers[fileName].forEach(({ resolve: success }) => success(template));
          } else {
            const error = new Error('Script was loaded, but component was not found.');

            reject(error);
            this.duplicateRequestHandlers[fileName].forEach(({ reject: fail }) => fail(error));
          }

          delete this.duplicateRequestHandlers[fileName];
        };
        script.async = true;
        script.onerror = () => reject(new Error('Failed to load script'));
        script.src = config.script;
        document.body.appendChild(script);
      }
    );
  }

  public async loadSecured(
    config: IComponentConfig,
    resourceOrScopes: string | string[] | undefined
  ): Promise<ComponentType<IComponentProps>> {
    if (!this.httpClient) throw new Error('HttpClient is not available for ComponentLoader');

    return new Promise(
      async (
        resolve: (componentType: ComponentType<IComponentProps>) => void,
        reject: (error: Error) => void
      ): Promise<void> => {
        if (!this.isValidComponentConfig(config)) return;

        const fileName =
          !config.fileName || config.fileName.length == 0 ? this.getFileName(config.script) : config.fileName;

        if (this.isComponentLoaded(fileName, config.name)) {
          return resolve(this.getComponentTemplate(fileName, config.name));
        }

        if (this.duplicateRequestHandlers.hasOwnProperty(fileName)) {
          this.duplicateRequestHandlers[fileName].push({
            resolve,
            reject,
          });

          return;
        }

        this.duplicateRequestHandlers[fileName] = this.duplicateRequestHandlers[fileName] || [];

        try {
          const result = await this.httpClient?.request<string>({
            url: config.script,
            responseType: 'text',
            resource: resourceOrScopes,
          });

          if (result?.data) {
            eval(result?.data);

            if (this.isComponentLoaded(fileName, config.name)) {
              const template = this.getComponentTemplate(fileName, config.name);

              resolve(template);

              this.duplicateRequestHandlers[fileName].forEach(({ resolve: success }) => success(template));
            } else {
              const error = new Error('Script was loaded, but component was not found.');
              reject(error);
              this.duplicateRequestHandlers[fileName].forEach(({ reject: fail }) => fail(error));
            }

            delete this.duplicateRequestHandlers[fileName];
          }
        } catch (e) {
          reject(e as Error);
        }
      }
    );
  }

  private getFileName(bundleLocation: string): string {
    const routes: string[] = bundleLocation.split('/');
    let fileName: string | undefined = routes.pop();
    if (!fileName) return '';
    if (fileName.indexOf('?') > -1) fileName = fileName.split('?')[0];

    return fileName.replace('.js', '');
  }

  private isComponentLoaded(fileName: string, componentName: string): boolean {
    return this.isScriptLoaded(fileName) && !!window.__WIDGETS__[fileName][componentName];
  }

  private isScriptLoaded(fileName: string): boolean {
    return !!window.__WIDGETS__[fileName];
  }

  private getComponentTemplate(fileName: string, componentName: string): ComponentType<IComponentProps> {
    return window.__WIDGETS__[fileName][componentName];
  }

  private isValidComponentConfig(componentConfig: IComponentConfig): boolean {
    if (!componentConfig.script) return false;
    if (!componentConfig.name) return false;

    return true;
  }
}
