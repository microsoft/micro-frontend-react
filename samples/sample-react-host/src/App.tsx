import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { ComponentProvider } from '@microsoft/micro-frontend-react/lib/ComponentProvider';
import { Context } from '@microsoft/micro-frontend-react/lib/Context';
import { Home } from './Home';

const userProvider = {
  getUserName: () => 'Sample User',
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
  <Context.Provider
    value={{
      userProvider,
    }}
  >
    <App />
  </Context.Provider>,
  document.getElementById('app')
);
