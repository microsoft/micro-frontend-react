import { AuthClient } from '@micro-frontend-react/employee-experience/lib/AuthClient';
import { TelemetryClient } from '@micro-frontend-react/employee-experience/lib/TelemetryClient';
import { HttpClient } from '@micro-frontend-react/employee-experience/lib/HttpClient';
import { GraphClient } from '@micro-frontend-react/employee-experience/lib/GraphClient';
import { Shell } from '@micro-frontend-react/employee-experience/lib/Shell';
import { withStore } from '@micro-frontend-react/employee-experience/lib/withStore';
import { StoreBuilder } from '@micro-frontend-react/employee-experience/lib/StoreBuilder';
import { ReducerRegistry } from '@micro-frontend-react/employee-experience/lib/ReducerRegistry';

const telemetryClient = new TelemetryClient({
  instrumentationKey: __INSTRUMENTATION_KEY__,
  UTPConfig: {
    EnvironmentName: 'Non-Production',
    ServiceOffering: 'Example Service Offering',
    ServiceLine: 'Example Service Line',
    Service: 'Example Service',
    ComponentName: 'Example Component',
    ComponentId: 'Example Id',
  },
  defaultProperties: {
    appName: __APP_NAME__,
  },
});
const authClient = new AuthClient(
  {
    auth: {
      clientId: __CLIENT_ID__,
      redirectUri: window.location.origin,
      authority: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47',
    },
  },
  telemetryClient
);

const httpClient = new HttpClient(telemetryClient, authClient);
const graphClient = new GraphClient(httpClient);

const reducerRegistry = new ReducerRegistry();
const appName = 'DemoApp';
const storeResult = new StoreBuilder(reducerRegistry, {})
  .configureLogger(__IS_DEVELOPMENT__)
  .configureSaga({ telemetryClient, authClient, httpClient, graphClient, appName })
  .build();

export const ShellWithStore = withStore(storeResult)(Shell);
