import * as React from 'react';
import { ReactReduxContext } from 'react-redux';
import { IComponentProps, CustomProperties } from './Models';
import { ComponentContext } from './ComponentContext';

export function withContext<T extends CustomProperties>(
  WrappedComponent: React.ComponentType<{
    context?: typeof ReactReduxContext;
    data?: T;
  }>
): React.ComponentType {
  const ComponentWithContext: React.ComponentType<IComponentProps> = (props: IComponentProps): React.ReactElement => {
    const { context, data, config, ...otherProps } = props;

    // @ts-ignore
    if (!config) return <WrappedComponent {...otherProps} />;

    ComponentWithContext.displayName = config.name;

    return (
      <ComponentContext.Provider value={context}>
        <WrappedComponent data={data as T} {...otherProps} />
      </ComponentContext.Provider>
    );
  };

  return ComponentWithContext as React.ComponentType;
}
