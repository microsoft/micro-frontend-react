import * as React from 'react';
import { ReactReduxContext } from 'react-redux';
import { IComponentProps, CustomProperties } from '../Models';
import { ComponentContext } from '../Contexts/ComponentContext';
import { ReduxContext } from '../Contexts/ReduxContext';

export function withContext<T extends CustomProperties>(
    WrappedComponent: React.ComponentType<{
        context?: typeof ReactReduxContext;
        data?: T;
    }>
): React.ComponentType {
    const ComponentWithContext: React.ComponentType<IComponentProps> = (props: IComponentProps): React.ReactElement => {
        const { context, data, config, reduxContext, ...otherProps } = props;
        if (!config) return <WrappedComponent {...otherProps} />;

        ComponentWithContext.displayName = config.name;

        let reactReduxContext: typeof ReactReduxContext | undefined = undefined;
        if (reduxContext) reactReduxContext = reduxContext.__redux_context__;

        if (!reactReduxContext) {
            return (
                <ComponentContext.Provider value={context}>
                    <WrappedComponent data={data as T} {...otherProps} />
                </ComponentContext.Provider>
            );
        }

        return (
            <ComponentContext.Provider value={context}>
                <ReduxContext.Provider value={reduxContext}>
                    <WrappedComponent context={reactReduxContext} data={data as T} {...otherProps} />
                </ReduxContext.Provider>
            </ComponentContext.Provider>
        );
    };

    return ComponentWithContext as React.ComponentType;
}
