import * as React from 'react';
import { Context } from '../Context';
import { IComponentProps } from '../IComponentProps';
import { IComponentProviderProps, IComponentProviderState, IDuplicateRequestHandlers } from './ComponentProvider.types';
import { IComponentConfig } from '../IComponentConfig';

export class ComponentProvider extends React.Component<IComponentProviderProps, IComponentProviderState> {
  public static contextType: React.Context<unknown> = Context;
  public context!: React.ContextType<typeof Context>;

  // Keeps track of same script being requested multiple times at once
  private duplicateRequestHandlers: IDuplicateRequestHandlers = {};

  public state: IComponentProviderState = {
    Component: null,
    hasError: false,
  };

  public async componentDidMount(): Promise<void> {
    this.updateStateOnLoad();
  }

  public async componentDidUpdate(prevProps: IComponentProviderProps): Promise<void> {
    const { config } = prevProps;
    if (this.shouldReload(config)) {
      this.updateStateOnLoad();
    }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const { onError } = this.props;
    if (onError) onError(error);

    console.error(error, errorInfo);
    this.setState({ hasError: true });
  }

  public render(): React.ReactElement | null {
    const { renderError, renderPlaceholder, config, data, ...otherProps } = this.props;
    const { Component, hasError } = this.state;

    if (hasError) return renderError ? renderError() : null;
    if (!Component) return renderPlaceholder ? renderPlaceholder() : null;

    return (
      <Component
        context={{ ...(this.context as Record<string, unknown>), ...((data as any) || {}) }}
        config={config}
        {...otherProps}
      />
    );
  }

  private shouldReload(prevConfig: IComponentConfig): boolean {
    const { config } = this.props;

    return prevConfig.name !== config.name || prevConfig.script !== config.script;
  }

  private async loadComponent(): Promise<React.ComponentType<IComponentProps>> {
    window.__MICRO_FRONTENDS__ = window.__MICRO_FRONTENDS__ || {};

    return new Promise(
      (
        resolve: (componentType: React.ComponentType<IComponentProps>) => void,
        reject: (error: Error) => void
      ): void => {
        const { onLoad, onLoaded, onError, config } = this.props;
        if (!this.isValidComponentConfig(config)) reject(new Error('Invalid configuration'));

        if (onLoad) onLoad(config);

        const fileName = this.getFileName(config.script);
        if (this.isComponentLoaded(fileName, config.name)) {
          if (onLoaded) onLoaded(config);
          return resolve(this.getComponentTemplate(fileName, config.name));
        }

        if (this.duplicateRequestHandlers.hasOwnProperty(fileName)) {
          this.duplicateRequestHandlers[fileName].push({
            resolve: (componentType: React.ComponentType<IComponentProps>) => {
              if (onLoaded) onLoaded(config);
              resolve(componentType);
            },
            reject: (error: Error) => {
              if (onError) onError(error);
              reject(error);
            },
          });

          return;
        }

        this.duplicateRequestHandlers[fileName] = this.duplicateRequestHandlers[fileName] || [];
        const script: HTMLScriptElement = document.createElement('script');

        script.onload = (): void => {
          if (this.isComponentLoaded(fileName, config.name)) {
            const template = this.getComponentTemplate(fileName, config.name);

            if (onLoaded) onLoaded(config);
            resolve(template);

            this.duplicateRequestHandlers[fileName].forEach(({ resolve: success }) => success(template));
          } else {
            const error = new Error('Script was loaded, but component was not found.');

            reject(error);
            if (onError) onError(error);
            this.duplicateRequestHandlers[fileName].forEach(({ reject: fail }) => fail(error));
          }

          delete this.duplicateRequestHandlers[fileName];
        };

        script.onerror = () => {
          const error = new Error('Failed to load script');

          reject(error);
          if (onError) onError(error);
        };

        script.async = true;
        script.src = config.script;

        document.body.appendChild(script);
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
    return this.isScriptLoaded(fileName) && !!window.__MICRO_FRONTENDS__[fileName][componentName];
  }

  private isScriptLoaded(fileName: string): boolean {
    return !!window.__MICRO_FRONTENDS__[fileName];
  }

  private getComponentTemplate(fileName: string, componentName: string): React.ComponentType<IComponentProps> {
    return window.__MICRO_FRONTENDS__[fileName][componentName];
  }

  private isValidComponentConfig(componentConfig: IComponentConfig): boolean {
    if (!componentConfig.script) return false;
    if (!componentConfig.name) return false;

    return true;
  }

  private async updateStateOnLoad(): Promise<void> {
    const component = await this.loadComponent();

    this.setState({
      Component: component,
      hasError: false,
    });
  }
}
