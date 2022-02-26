import * as React from 'react';
import { Provider, useSelector, ReactReduxContext } from 'react-redux';
import { IStoreBuilderResult, ShellComponentType } from '../Models';
import { ReduxContext } from '../Contexts/ReduxContext';

export function withStore<T>(
  storeBuilderResult: IStoreBuilderResult<T>
): (WrappedComponent: ShellComponentType) => React.ComponentType {
  const { store, context, ...otherResults } = storeBuilderResult;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (WrappedComponent: React.ComponentType): React.ComponentType => {
    const ComponentWithStore: React.ComponentType = (
      // eslint-disable-next-line @typescript-eslint/ban-types
      props: React.PropsWithChildren<{}>
    ): React.ReactElement => {
      const { children } = props;

      return (
        <Provider store={store}>
          <ReduxContext.Provider
            value={{
              dispatch: store.dispatch,
              useSelector,
              __redux_context__: ReactReduxContext,
              ...otherResults,
            }}
          >
            <WrappedComponent {...context}>{children}</WrappedComponent>
          </ReduxContext.Provider>
        </Provider>
      );
    };

    return ComponentWithStore;
  };
}
