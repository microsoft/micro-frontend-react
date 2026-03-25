import * as React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { ComponentProvider } from '@micro-frontend-react/core/lib/ComponentProvider';
import { IComponentProviderProps } from '@micro-frontend-react/core/lib/ComponentProvider/ComponentProvider.types';

export function RouteComponentProvider(props: IComponentProviderProps & RouteProps): React.ReactElement {
  const { path, config, exact, ...otherProps } = props;

  return (
    <Route
      path={path}
      exact={exact}
      render={(): React.ReactElement => <ComponentProvider config={config} {...otherProps} />}
    />
  );
}
