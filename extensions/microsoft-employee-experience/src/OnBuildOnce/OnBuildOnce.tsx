import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { IAuthClient } from '../IAuthClient';
import { ITelemetryClient } from '../ITelemetryClient';
import { withStore } from '../withStore';
import { Shell } from '../Shell';
import { GraphClient } from '../GraphClient';
import { HttpClient } from '../HttpClient';
import { ReducerRegistry } from '../ReducerRegistry';
import { StoreBuilder } from '../StoreBuilder';
import { v4 as guid } from 'uuid';

export type BuildOnceAppOptions = {
  appName: string;
  isProduction?: boolean;
  authClient: IAuthClient;
  telemetryClient: ITelemetryClient;
};

export function OnBuildOnce(Component: React.ComponentType, options: BuildOnceAppOptions) {
  const { appName, authClient, telemetryClient } = options;

  const httpClient = new HttpClient(telemetryClient, authClient);
  const graphClient = new GraphClient(httpClient);
  const reducerRegistry = new ReducerRegistry();
  const storeResult = new StoreBuilder(reducerRegistry, {})
    .configureLogger(!options.isProduction)
    .configureSaga({ telemetryClient, authClient, httpClient, graphClient, appName })
    .configurePersistor({
      key: appName || Component.displayName || guid(),
    })
    .build();

  const ShellWithStore = withStore(storeResult)(Shell);

  render(
    <ShellWithStore>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    </ShellWithStore>,
    document.getElementById('app')
  );
}
