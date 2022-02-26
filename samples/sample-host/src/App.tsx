import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Shell } from '@microsoft/micro-frontend/lib/Shell';
import { RouteComponentProvider } from '@microsoft/micro-frontend/lib/RouteComponentProvider';
import { ComponentLoader } from '@microsoft/micro-frontend/lib/ComponentLoader';
import { DummyAuthClient } from './DummyAuthClient';
import { Home } from './Home';
import { Layout } from './Layout';

const authClient = new DummyAuthClient();
const componentLoader = new ComponentLoader({}, {});

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
        />
      </Layout>
    </BrowserRouter>
  );
}

render(
  <Shell authClient={authClient} componentLoader={componentLoader}>
    <App />
  </Shell>,
  document.getElementById('app')
);
