import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { RouteComponentProvider } from '@microsoft/micro-frontend/lib/RouteComponentProvider';
import { ReduxComponentProviderExtension } from '@microsoft/micro-frontend-redux/lib/ReduxComponentProviderExtension';
import { Home } from './Home';
import { Layout } from './Layout';
import { ShellWithStore } from './ShellWithStore';

export function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Layout>
        <Route path="/" exact component={Home} />
        <RouteComponentProvider
          path="/micro-frontend"
          config={{
            script: 'http://localhost:8000/bundles/micro-frontend-app.js',
            name: 'MicroFrontendApp',
          }}
          extension={ReduxComponentProviderExtension}
        />
      </Layout>
    </BrowserRouter>
  );
}

render(
  <ShellWithStore>
    <App />
  </ShellWithStore>,
  document.getElementById('app')
);
