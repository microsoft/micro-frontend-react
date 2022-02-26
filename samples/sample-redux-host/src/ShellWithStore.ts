import { IDefaultState } from '@microsoft/micro-frontend-redux/lib/IDefaultState';
import { ReducerRegistry } from '@microsoft/micro-frontend-redux/lib/ReducerRegistry';
import { StoreBuilder } from '@microsoft/micro-frontend-redux/lib/StoreBuilder';
import { withStore } from '@microsoft/micro-frontend-redux/lib/withStore';
import { ComponentLoader } from '@microsoft/micro-frontend/lib/ComponentLoader';
import { Shell } from '@microsoft/micro-frontend/lib/Shell';
import { DummyHttpClient } from './DummyHttpClient';

type AppState = IDefaultState & {
  storeData: { hostAppName: string };
};

const httpClient = new DummyHttpClient();
const componentLoader = new ComponentLoader({}, httpClient);
const reducerRegistry = new ReducerRegistry();
const appName = 'DemoApp';

const store = new StoreBuilder<AppState>(reducerRegistry, {
  storeData: {
    hostAppName: __APP_NAME__,
  },
})
  .configureLogger(__IS_DEVELOPMENT__)
  .configureSaga({ httpClient, componentLoader, appName })
  .build();

export const ShellWithStore = withStore(store)(Shell);
