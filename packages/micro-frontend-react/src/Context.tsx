import * as React from 'react';
import { Context as ReactContext, createContext } from 'react';
import { IComponentProps } from './IComponentProps';

export const Context: ReactContext<unknown> = createContext<unknown>({});

export function withContext(WrappedComponent: React.ComponentType): React.ComponentType {
  const ComponentWithContext: React.ComponentType<IComponentProps> = (props: IComponentProps): React.ReactElement => {
    const { context, config, ...otherProps } = props;

    // Having no config means that this component is not a micro-frontend,
    // and there is no need to re-initialize the Context
    if (!config) return <WrappedComponent {...otherProps} />;

    ComponentWithContext.displayName = config.name;

    return (
      <Context.Provider value={context}>
        <WrappedComponent {...otherProps} />
      </Context.Provider>
    );
  };

  return ComponentWithContext as React.ComponentType;
}
