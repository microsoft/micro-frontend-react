import * as React from 'react';
import { ComponentContext } from '../../Contexts/ComponentContext';
import { IComponentProviderProps, IComponentProviderState } from './ComponentProvider.types';
import { IComponentConfig, IComponentContext, UserAttribute, UsageHelper } from '../../Models/';
import { ReduxContext } from '../../Contexts/ReduxContext';

export class ComponentProvider extends React.Component<IComponentProviderProps, IComponentProviderState> {
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
        const { renderError, renderPlaceholder, config, ...otherProps } = this.props;
        const { Component, hasError } = this.state;
        const newTelemetryContext = this.getChildTelemetryContext(config);
        const newTelemetryClient = this.context.telemetryClient.getChildInstance();
        const newHttpClient = this.context.httpClient.getChildInstance(newTelemetryClient, this.context.authClient);
        newTelemetryClient.setContext(newTelemetryContext);
        const newContext: IComponentContext = {
            ...this.context,
            id: config.id || config.name,
            telemetryContext: newTelemetryContext,
            telemetryClient: newTelemetryClient,
            httpClient: newHttpClient,
        };
        if (hasError) return renderError ? renderError() : null;
        if (!Component) return renderPlaceholder ? renderPlaceholder() : null;

        return (
            <ReduxContext.Consumer>
                {(reduxContext): React.ReactElement => (
                    <Component context={newContext} reduxContext={reduxContext} config={config} {...otherProps} />
                )}
            </ReduxContext.Consumer>
        );
    }

    private getChildTelemetryContext(config: IComponentConfig) {
        if (this.context.telemetryContext) {
            return this.context.telemetryContext?.getChildContext(
                config.usageFeatureName ?? config.name,
                config.script
            );
        } else {
            // Fallback to the default UsageHelper and fork a childContext instance
            const newUsageHelper = UsageHelper.Fork(config.usageFeatureName ?? config.name);
            return {
                sourceComponent: config.name,
                sourceScript: config.script,
                setUsageEvent: newUsageHelper.MassageEvent,
                setUsageUser: (usageUser: UserAttribute): UserAttribute => {
                    newUsageHelper.SetUser(usageUser);
                    return usageUser;
                },
                usageUser: newUsageHelper.GetUser,
                setUsageConfig: newUsageHelper.SetUsageConfig,
                getChildContext: newUsageHelper.ForkTelemetryContext,
            };
        }
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
