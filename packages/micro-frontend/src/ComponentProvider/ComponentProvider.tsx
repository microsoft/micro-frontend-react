import * as React from 'react';
import { ComponentContext } from '../ComponentContext';
import { IComponentProviderProps, IComponentProviderState } from './ComponentProvider.types';
import { IComponentConfig, IComponentContext } from '../Models';

export class ComponentProvider<T> extends React.Component<IComponentProviderProps<T>, IComponentProviderState> {
  public static contextType: React.Context<IComponentContext> = ComponentContext;
  public context!: React.ContextType<typeof ComponentContext>;

  public state: IComponentProviderState = {
    Component: null,
    hasError: false,
  };

  public async componentDidMount(): Promise<void> {
    if (this.props.config.common) {
      this.context.componentLoader.loadCommon(this.props.config.common).then(() => {
        setTimeout(() => {
          this.loadComponent().catch();
        }, Math.random() * 1000);
      });
    } else {
      this.loadComponent().catch();
    }
  }

  public async componentDidUpdate(prevProps: IComponentProviderProps): Promise<void> {
    const { config } = prevProps;

    if (this.shouldReload(config)) await this.loadComponent();
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.context.telemetryClient.trackException({
      exception: error,
      properties: {
        ...errorInfo,
      },
    });
    console.error(error, errorInfo);

    this.setState({ hasError: true });
  }

  public render(): React.ReactElement | null {
    const { renderError, renderPlaceholder, config, extension: Extension, ...otherProps } = this.props;
    const { Component, hasError } = this.state;
    const newContext: IComponentContext = {
      ...this.context,
      id: config.id || config.name,
    };

    if (hasError) return renderError ? renderError() : null;
    if (!Component) return renderPlaceholder ? renderPlaceholder() : null;

    if (Extension) {
      return (
        <Extension>
          {(extensionContext: T) => (
            <Component context={newContext} reduxContext={extensionContext} config={config} {...otherProps} />
          )}
        </Extension>
      );
    }

    return <Component context={newContext} config={config} reduxContext={undefined} {...otherProps} />;
  }

  private shouldReload(prevConfig: IComponentConfig): boolean {
    const { config } = this.props;

    return prevConfig.name !== config.name || prevConfig.script !== config.script;
  }

  private async loadComponent(): Promise<void> {
    const { config, resource, scopes } = this.props;
    const { componentLoader } = this.context;

    try {
      let Component = null;
      if (resource || scopes) {
        Component = await componentLoader.loadSecured(config, (resource || scopes) as string | string[]);
      } else {
        Component = await componentLoader.load(config);
      }

      this.setState({ Component, hasError: false });
    } catch (e) {
      console.error(e);
      this.context.telemetryClient.trackException({
        exception: e as Error,
      });

      this.setState({ hasError: true });
    }
  }
}
