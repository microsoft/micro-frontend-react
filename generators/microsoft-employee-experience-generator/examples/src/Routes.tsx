import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { RouteComponentProvider } from '@micro-frontend-react/employee-experience/lib/RouteComponentProvider';

export function Routes(): React.ReactElement {
  return (
    <Switch>
      <RouteComponentProvider
        path="/"
        config={{
          script: '/bundles/dynamic-redux-hooks.js',
          name: 'DynamicReduxHooks',
        }}
        exact
      />
      <RouteComponentProvider
        path="/dynamic-sub-routes"
        config={{
          script: '/bundles/dynamic-sub-routes.js',
          name: 'DynamicSubRoutes',
        }}
      />
    </Switch>
  );
}
