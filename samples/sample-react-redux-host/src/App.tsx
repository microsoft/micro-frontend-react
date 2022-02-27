import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { ComponentProvider } from '@microsoft/micro-frontend-react/lib/ComponentProvider';
import { Context } from '@microsoft/micro-frontend-react/lib/Context';
import { ReducerRegistry } from '@microsoft/micro-frontend-react-redux/lib/ReducerRegistry';
import { StoreBuilder } from '@microsoft/micro-frontend-react-redux/lib/StoreBuilder';
import { injectReduxContext } from '@microsoft/micro-frontend-react-redux/lib/InjectReduxContext';
import { DummyHttpClient } from './DummyHttpClient';
import { hostReducer, HostState } from './SampleHostReduxStore';
import { Home } from './Home';

const httpClient = new DummyHttpClient();
const reducerRegistry = new ReducerRegistry().register('host', hostReducer);
const appName = 'DemoApp';

const storeBuilderResult = new StoreBuilder(reducerRegistry, {})
  .configureLogger(__IS_DEVELOPMENT__)
  .configureSaga({ httpClient, appName })
  .build();

export type AppState = {
  host: HostState;
};

export function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />

      <Route
        path="/micro-frontend"
        render={() => (
          <ComponentProvider
            config={{
              script: 'http://localhost:8000/bundles/micro-frontend-app.js',
              name: 'MicroFrontendApp',
            }}
          />
        )}
      />
    </BrowserRouter>
  );
}

render(
  <Provider store={storeBuilderResult.store}>
    <Context.Provider value={injectReduxContext(storeBuilderResult)}>
      <App />
    </Context.Provider>
  </Provider>,
  document.getElementById('app')
);
