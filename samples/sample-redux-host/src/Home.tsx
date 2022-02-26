import * as React from 'react';
import { ComponentProvider } from '@microsoft/micro-frontend/lib/ComponentProvider';
import { ReduxComponentProviderExtension } from '@microsoft/micro-frontend-redux/lib/ReduxComponentProviderExtension';
import { ReduxContext } from '@microsoft/micro-frontend-redux/lib/ReduxContext';
import { AppState } from './ShellWithStore';

export function Home(): React.ReactElement {
  const { useSelector } = React.useContext(ReduxContext);

  const hostAppName = useSelector((appState: AppState) => appState.host.hostAppName);

  return (
    <>
      <div>Hello from {hostAppName};</div>
      <ComponentProvider
        config={{
          script: 'http://localhost:8000/bundles/micro-frontend-app.js',
          name: 'MicroFrontendApp',
        }}
        extension={ReduxComponentProviderExtension}
      />
    </>
  );
}
