import { ReducerRegistry } from '@microsoft/micro-frontend-redux/lib/ReducerRegistry';
import { StoreBuilder } from '@microsoft/micro-frontend-redux/lib/StoreBuilder';
import { withStore } from '@microsoft/micro-frontend-redux/lib/withStore';
import { ComponentLoader } from '@microsoft/micro-frontend/lib/ComponentLoader';
import { Shell } from '@microsoft/micro-frontend/lib/Shell';
import { DummyHttpClient } from './DummyHttpClient';
import { hostReducer, HostState } from './SampleHostReduxStore';

const httpClient = new DummyHttpClient();
const componentLoader = new ComponentLoader({}, httpClient);
const reducerRegistry = new ReducerRegistry().register('host', hostReducer);
const appName = 'DemoApp';

const store = new StoreBuilder(reducerRegistry, {})
  .configureLogger(__IS_DEVELOPMENT__)
  .configureSaga({ httpClient, componentLoader, appName })
  .build();

export type AppState = {
  host: HostState;
};
export const ShellWithStore = withStore(store)(Shell);
