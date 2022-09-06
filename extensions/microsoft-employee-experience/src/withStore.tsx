import * as React from 'react';
import { Provider } from 'react-redux';
import { IStoreBuilderResult } from '@micro-frontend-react/redux/lib/IStoreBuilderResult';
import { injectReduxContext } from '@micro-frontend-react/redux/lib/InjectReduxContext';
import { IEmployeeExperienceContext } from './IEmployeeExperienceContext';

export function withStore<T extends {}>(
  storeBuilderResult: IStoreBuilderResult<T>
): (WrappedComponent: React.ComponentType<IEmployeeExperienceContext>) => React.ComponentType {
  const { store, context, ...otherResults } = storeBuilderResult;

  return (WrappedComponent: React.ComponentType<IEmployeeExperienceContext>): React.ComponentType => {
    const ComponentWithStore: React.ComponentType = (props: React.PropsWithChildren<unknown>): React.ReactElement => {
      const { children } = props;

      const childProps = {
        ...(context as IEmployeeExperienceContext),
        ...otherResults,
        ...injectReduxContext(storeBuilderResult),
      };

      return (
        <Provider store={store}>
          <WrappedComponent {...childProps}>{children}</WrappedComponent>
        </Provider>
      );
    };

    return ComponentWithStore;
  };
}
