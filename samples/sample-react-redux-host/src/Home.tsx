import * as React from 'react';
import { ComponentProvider } from '@micro-frontend-react/core/lib/ComponentProvider';
import { Context } from '@micro-frontend-react/core/lib/Context';
import { IReduxContext } from '@micro-frontend-react/redux/lib/IReduxContext';
import { AppState } from './App';

export function Home(): React.ReactElement {
  const { useSelector } = React.useContext(Context as React.Context<IReduxContext>);

  const hostAppName = useSelector((appState: AppState) => appState.host.hostAppName);

  return (
    <>
      <div
        style={{
          backgroundColor: 'rgb(54, 162, 235)',
        }}
      >
        Hello from {hostAppName}
      </div>

      <ComponentProvider
        config={{
          script: 'http://localhost:8000/bundles/micro-frontend-app.js',
          name: 'MicroFrontendApp',
        }}
      />
    </>
  );
}
