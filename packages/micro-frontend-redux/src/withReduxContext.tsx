import * as React from 'react';
import { ReactReduxContext } from 'react-redux';
import { IComponentProps } from '@microsoft/micro-frontend/lib/Models/IComponentProps';
import { CustomProperties } from '@microsoft/micro-frontend/lib/Models/CustomProperties';
import { ComponentContext } from '@microsoft/micro-frontend/lib/ComponentContext';
import { IReduxContext } from './IReduxContext';
import { ReduxContext } from './ReduxContext';

export interface IReduxComponentProps extends IComponentProps {
  reduxContext: IReduxContext;
}

export function withReduxContext<T extends CustomProperties>(
  WrappedComponent: React.ComponentType<{
    context?: typeof ReactReduxContext;
    data?: T;
  }>
): React.ComponentType {
  const ComponentWithContext: React.ComponentType<IReduxComponentProps> = (
    props: IReduxComponentProps
  ): React.ReactElement => {
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
