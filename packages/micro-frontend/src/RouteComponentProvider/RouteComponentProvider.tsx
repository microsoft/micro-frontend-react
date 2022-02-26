import * as React from 'react';
import { Route } from 'react-router-dom';
import { ComponentProvider } from '../ComponentProvider';
import { IRouteComponentProviderProps } from './RouteComponentProvider.types';

export function RouteComponentProvider(props: IRouteComponentProviderProps): React.ReactElement {
  const { path, config, isExact, exact, ...otherProps } = props;

  return (
    <Route
      path={path}
      exact={isExact || exact}
      render={(): React.ReactElement => <ComponentProvider config={config} {...otherProps} />}
    />
  );
}
